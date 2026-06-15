import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import ws from 'ws';

const app = express();
app.use(cors());
app.use(express.json());

// ── Model ──────────────────────────────────────────────────────
const MODEL = 'anthropic/claude-sonnet-4-5';

// ── Rate limit store (in-memory, reset tiap server restart) ───
// Format: { [codeId_feature]: 'YYYY-MM-DD' }
const usageStore = {};

function todayDate() {
  return new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'
}

function checkRateLimit(codeId, feature) {
  if (!codeId) return false;
  const key = `${codeId}_${feature}`;
  const lastUsed = usageStore[key];
  const today = todayDate();
  if (lastUsed === today) return true;
  return false;
}

function markUsed(codeId, feature) {
  if (!codeId) return;
  const key = `${codeId}_${feature}`;
  usageStore[key] = todayDate();
}

// ── Supabase Admin (service role — server only) ──────────────────────────
const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,
  { realtime: { transport: ws } }
);

// ── Session store ─────────────────────────────────────────────────────────
// Format: { token: { codeId, name, role, createdAt } }
const sessions = {};

// ── IP-based login rate limiter ───────────────────────────────────────────
const loginAttempts = {};

function getIp(req) {
  return req.headers['x-forwarded-for']?.split(',')[0] || req.ip || 'unknown';
}

function checkLoginRateLimit(ip) {
  const now = Date.now();
  if (!loginAttempts[ip]) loginAttempts[ip] = [];
  loginAttempts[ip] = loginAttempts[ip].filter(t => now - t < 15 * 60 * 1000);
  if (loginAttempts[ip].length >= 10) return false;
  loginAttempts[ip].push(now);
  return true;
}

function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

// ── POST /api/auth/login ───────────────────────────────────────────────────
app.post('/api/auth/login', async (req, res) => {
  const ip = getIp(req);
  if (!checkLoginRateLimit(ip)) {
    return res.status(429).json({
      error: 'rate_limit',
      message: 'Terlalu banyak percobaan. Tunggu 15 menit.',
    });
  }

  const { code } = req.body;
  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'Kode tidak valid' });
  }

  const clean = code.trim().toUpperCase();

  // Admin login (12 karakter)
  if (clean.length === 12) {
    const { data } = await supabaseAdmin
      .from('admin_codes')
      .select('id')
      .eq('code', clean)
      .single();
    if (!data) return res.status(401).json({ error: 'Kode admin tidak valid' });
    const token = generateToken();
    sessions[token] = { role: 'admin', codeId: null, name: 'Admin', createdAt: Date.now() };
    return res.json({ token, name: 'Admin', role: 'admin' });
  }

  // Member login (6 digit angka)
  if (!/^\d{6}$/.test(clean)) {
    return res.status(400).json({ error: 'Format kode tidak valid' });
  }

  const { data, error } = await supabaseAdmin
    .from('member_codes')
    .select('id, name, is_active')
    .eq('code', clean)
    .single();

  if (error || !data) return res.status(401).json({ error: 'Kode tidak ditemukan' });
  if (!data.is_active) return res.status(403).json({ error: 'Kode tidak aktif' });

  const token = generateToken();
  sessions[token] = { role: 'member', codeId: data.id, name: data.name || 'Akhi', createdAt: Date.now() };

  // Hapus session lama (> 30 hari)
  const maxAge = 30 * 24 * 60 * 60 * 1000;
  for (const [t, s] of Object.entries(sessions)) {
    if (Date.now() - s.createdAt > maxAge) delete sessions[t];
  }

  return res.json({ token, codeId: data.id, name: data.name || 'Akhi', role: 'member' });
});

// ── GET /api/auth/me ───────────────────────────────────────────────────────
app.get('/api/auth/me', (req, res) => {
  const token = req.headers['x-session-token'];
  if (!token || !sessions[token]) return res.status(401).json({ error: 'Unauthorized' });
  const s = sessions[token];
  res.json({ codeId: s.codeId, name: s.name, role: s.role });
});

// ── Middleware: verifikasi token ───────────────────────────────────────────
function requireAuth(req, res, next) {
  const token = req.headers['x-session-token'];
  if (!token || !sessions[token]) return res.status(401).json({ error: 'Unauthorized' });
  req.session = sessions[token];
  next();
}

// ── POST /api/user/save ────────────────────────────────────────────────────
app.post('/api/user/save', requireAuth, async (req, res) => {
  const { codeId } = req.session;
  const { data: payload } = req.body;
  if (!codeId || !payload) return res.status(400).json({ error: 'Invalid' });
  const { error } = await supabaseAdmin
    .from('user_data')
    .upsert({ code_id: codeId, data: payload }, { onConflict: 'code_id' });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

// ── GET /api/user/load ─────────────────────────────────────────────────────
app.get('/api/user/load', requireAuth, async (req, res) => {
  const { codeId } = req.session;
  if (!codeId) return res.status(400).json({ error: 'Invalid' });
  const { data, error } = await supabaseAdmin
    .from('user_data')
    .select('data')
    .eq('code_id', codeId)
    .single();
  if (error && error.code !== 'PGRST116') return res.status(500).json({ error: error.message });
  res.json({ data: data?.data || null });
});

// ── POST /api/admin/codes ──────────────────────────────────────────────────
app.post('/api/admin/codes', requireAuth, async (req, res) => {
  if (req.session.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  const { name } = req.body;
  const code = String(Math.floor(100000 + Math.random() * 900000));
  const { data, error } = await supabaseAdmin
    .from('member_codes')
    .insert({ code, name: name?.trim() || '', is_active: true })
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ code: data.code, id: data.id });
});

// ── GET /api/admin/members ─────────────────────────────────────────────────
app.get('/api/admin/members', requireAuth, async (req, res) => {
  if (req.session.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  const { data: codes } = await supabaseAdmin.from('member_codes').select('*').order('created_at', { ascending: false });
  const { data: users } = await supabaseAdmin.from('user_data').select('*').order('updated_at', { ascending: false });
  res.json({ codes: codes || [], users: users || [] });
});

// ── PATCH /api/admin/codes/:id ─────────────────────────────────────────────
app.patch('/api/admin/codes/:id', requireAuth, async (req, res) => {
  if (req.session.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  const { id } = req.params;
  const { is_active, name } = req.body;
  const update = {};
  if (is_active !== undefined) update.is_active = is_active;
  if (name !== undefined) update.name = name;
  const { error } = await supabaseAdmin.from('member_codes').update(update).eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

// ── DELETE /api/admin/codes/:id ────────────────────────────────────────────
app.delete('/api/admin/codes/:id', requireAuth, async (req, res) => {
  if (req.session.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  const { error } = await supabaseAdmin.from('member_codes').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

// ── Journal Enhance ────────────────────────────────────────────
app.post('/api/journal/enhance', async (req, res) => {
  const apiKey = process.env.OPENROUTER_KEY;
  if (!apiKey) return res.status(503).json({ error: 'AI feature not configured' });

  const { text, codeId } = req.body;
  if (!text || text.length < 10) return res.status(400).json({ error: 'Text too short' });

  if (checkRateLimit(codeId, 'journal')) {
    return res.status(429).json({
      error: 'rate_limit',
      message: 'Fitur Rapikan AI hanya bisa digunakan 1x per hari. Coba lagi besok.',
    });
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://deenme.app',
        'X-Title': 'Deenme Journal',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: 'system',
            content: `Kamu adalah asisten jurnal pribadi Muslim yang bertugas merapikan dan memperindah catatan harian.

Tugasmu:
1. Perbaiki diksi dan tata bahasa Indonesia (santai tapi tetap elegan)
2. Strukturkan dengan markdown: gunakan ## untuk heading utama, ### untuk sub-heading jika perlu
3. Pisahkan paragraf dengan baik
4. Pertahankan makna, suasana, dan kesan personal dari tulisan asli — jangan ubah fakta atau perasaan
5. Jika ada ungkapan Arab/doa, pertahankan dengan benar
6. Jangan tambahkan konten yang tidak ada di tulisan asli
7. Mulai langsung dengan konten, tanpa pengantar atau penjelasan apapun
8. Output hanya markdown, tidak ada komentar tambahan`,
          },
          { role: 'user', content: text },
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content;
    if (result) {
      markUsed(codeId, 'journal');
      res.json({ result });
    } else {
      res.status(500).json({ error: 'No response from AI' });
    }
  } catch (err) {
    console.error('OpenRouter error:', err);
    res.status(500).json({ error: 'AI request failed' });
  }
});

// ── Dream Tafsir ───────────────────────────────────────────────
app.post('/api/dream/tafsir', async (req, res) => {
  const apiKey = process.env.OPENROUTER_KEY;
  if (!apiKey) return res.status(503).json({ error: 'AI feature not configured' });

  const { text, codeId } = req.body;
  if (!text || text.length < 10) return res.status(400).json({ error: 'Text too short' });

  if (checkRateLimit(codeId, 'dream')) {
    return res.status(429).json({
      error: 'rate_limit',
      message: 'Tafsir Mimpi hanya bisa digunakan 1x per hari. Coba lagi besok ya.',
    });
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://deenme.app',
        'X-Title': 'Deenme Tafsir Mimpi',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: 'system',
            content: `Kamu adalah ahli tafsir mimpi Islam yang menguasai kitab Tafsir Al-Ahlam karya Ibnu Sirin, serta memahami psikologi modern tentang mimpi (Jung, Freud, neurosains mimpi).

Tugas kamu: tafsirkan mimpi yang diceritakan user dengan pendekatan:
1. **Perspektif Islam** — berdasarkan kitab tafsir mimpi ulama (terutama Ibnu Sirin dan Al-Nabulsi). Sebutkan referensi kitab jika relevan.
2. **Perspektif Psikologi Modern** — apa yang mungkin disampaikan alam bawah sadar.
3. **Nasihat & Amalan** — anjuran amalan atau doa yang relevan setelah mimpi tersebut.

Format jawaban dalam Markdown yang rapi:
- Gunakan ## untuk heading utama
- Gunakan **bold** untuk poin penting
- Tulis dengan bahasa Indonesia yang hangat dan bijaksana
- Jika mimpi buruk (nightmare), anjurkan membaca ta'awwudz dan meludah ke kiri 3x
- Jika mimpi baik, anjurkan bersyukur dan tidak menceritakan ke sembarang orang
- Panjang jawaban: 300-500 kata
- Jangan membuat klaim pasti tentang takdir — ini hanya tafsir, bukan ramalan`,
          },
          { role: 'user', content: `Mimpi saya: ${text}` },
        ],
        max_tokens: 1500,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content;
    if (result) {
      markUsed(codeId, 'dream');
      res.json({ result });
    } else {
      res.status(500).json({ error: 'No response from AI' });
    }
  } catch (err) {
    console.error('OpenRouter dream tafsir error:', err);
    res.status(500).json({ error: 'AI request failed' });
  }
});

// ── Doa Situasional AI ─────────────────────────────────────────
app.post('/api/doa/situasional', async (req, res) => {
  const apiKey = process.env.OPENROUTER_KEY;
  if (!apiKey) return res.status(503).json({ error: 'AI feature not configured' });

  const { situasi, codeId } = req.body;
  if (!situasi || situasi.length < 3) return res.status(400).json({ error: 'Cerita terlalu singkat' });

  if (checkRateLimit(codeId, 'doa_situasional')) {
    return res.status(429).json({
      error: 'rate_limit',
      message: 'Fitur Cari Doa AI hanya bisa digunakan 1x per hari. Coba lagi besok.',
    });
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://deenme.app',
        'X-Title': 'Deenme Doa Situasional',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: 'system',
            content: `Kamu adalah asisten Muslim yang membantu menemukan doa yang paling tepat berdasarkan situasi yang dialami user.

Dari cerita atau situasi yang disampaikan user, rekomendasikan 2-3 doa yang paling relevan.

Untuk setiap doa, berikan:
1. **Nama doa** dalam bahasa Indonesia
2. **Bacaan Arab** (teks Arab yang benar)
3. **Latin** (transliterasi)
4. **Artinya** dalam bahasa Indonesia yang natural
5. **Kenapa doa ini cocok** untuk situasi mereka (1-2 kalimat, hangat dan personal)
6. **Sumber** (nama hadits/Al-Quran dan nomor jika ada)

Format output JSON array seperti ini (tidak ada teks lain selain JSON):
[
  {
    "name": "Nama Doa",
    "ar": "النص العربي",
    "latin": "teks latin",
    "arti": "artinya dalam bahasa Indonesia",
    "alasan": "kenapa doa ini cocok untuk situasimu",
    "sumber": "HR. Bukhari no. XXXX"
  }
]

Jawab HANYA dengan JSON array. Tidak ada penjelasan, tidak ada kalimat pembuka.`,
          },
          { role: 'user', content: situasi },
        ],
        max_tokens: 1200,
        temperature: 0.5,
      }),
    });

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content || '';

    try {
      const clean = raw.replace(/```json|```/g, '').trim();
      const doas  = JSON.parse(clean);
      markUsed(codeId, 'doa_situasional');
      res.json({ doas });
    } catch {
      res.status(500).json({ error: 'Gagal parse respons AI' });
    }
  } catch (err) {
    console.error('OpenRouter doa situasional error:', err);
    res.status(500).json({ error: 'AI request failed' });
  }
});

const PORT = process.env.API_PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`API server running on port ${PORT} — model: ${MODEL}`);
});
