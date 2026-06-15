import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { WebSocket } from 'ws';

const app = express();
app.use(cors());
app.use(express.json());

// ── Supabase admin client (service role — server only) ──────────
// Node 20 needs ws package for WebSocket (native WS only in Node 22+)
const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,
  { realtime: { transport: WebSocket } }
);

// ── Model AI ────────────────────────────────────────────────────
const MODEL = 'anthropic/claude-sonnet-4-5';

// ── In-memory stores ────────────────────────────────────────────
const sessions      = {};  // token → { codeId, name, role, createdAt }
const loginAttempts = {};  // ip → [timestamps]
const aiUsage       = {};  // codeId_feature → 'YYYY-MM-DD'

// ── Helpers ─────────────────────────────────────────────────────
const todayStr = () => new Date().toISOString().slice(0, 10);

function getIp(req) {
  return (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.ip || 'unknown';
}

function checkIpRateLimit(ip) {
  const now = Date.now();
  loginAttempts[ip] = (loginAttempts[ip] || []).filter(t => now - t < 15 * 60 * 1000);
  if (loginAttempts[ip].length >= 10) return false;
  loginAttempts[ip].push(now);
  return true;
}

function checkAiLimit(codeId, feature) {
  return aiUsage[`${codeId}_${feature}`] === todayStr();
}

function markAiUsed(codeId, feature) {
  aiUsage[`${codeId}_${feature}`] = todayStr();
}

function requireAuth(req, res, next) {
  const token = req.headers['x-session-token'];
  const session = sessions[token];
  if (!session) return res.status(401).json({ error: 'Unauthorized' });
  if (Date.now() - session.createdAt > 30 * 24 * 60 * 60 * 1000) {
    delete sessions[token];
    return res.status(401).json({ error: 'Session expired' });
  }
  req.session = session;
  next();
}

function requireAdmin(req, res, next) {
  if (req.session.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  next();
}

// ══════════════════════════════════════════════════════════════
// AUTH
// ══════════════════════════════════════════════════════════════

app.post('/api/auth/login', async (req, res) => {
  const ip = getIp(req);
  if (!checkIpRateLimit(ip)) {
    return res.status(429).json({ error: 'rate_limit', message: 'Terlalu banyak percobaan. Tunggu 15 menit.' });
  }

  const { code } = req.body;
  if (!code || typeof code !== 'string') return res.status(400).json({ error: 'Kode tidak valid' });

  const clean = code.trim();

  // Admin (12 karakter)
  if (clean.length === 12) {
    const { data } = await supabaseAdmin.from('admin_codes').select('id').eq('code', clean).single();
    if (!data) return res.status(401).json({ error: 'Kode admin tidak valid' });
    const token = crypto.randomBytes(32).toString('hex');
    sessions[token] = { role: 'admin', codeId: null, name: 'Admin', createdAt: Date.now() };
    return res.json({ token, name: 'Admin', role: 'admin', codeId: null });
  }

  // Member (6 digit angka)
  if (!/^\d{6}$/.test(clean)) return res.status(400).json({ error: 'Format kode tidak valid' });

  const { data, error } = await supabaseAdmin
    .from('member_codes').select('id, name, is_active').eq('code', clean).single();

  if (error || !data) return res.status(401).json({ error: 'Kode tidak ditemukan' });
  if (!data.is_active) return res.status(403).json({ error: 'Kode tidak aktif. Hubungi admin.' });

  const token = crypto.randomBytes(32).toString('hex');
  sessions[token] = { role: 'member', codeId: data.id, name: data.name || 'Akhi', createdAt: Date.now() };
  return res.json({ token, name: data.name || 'Akhi', role: 'member', codeId: data.id });
});

app.get('/api/auth/me', requireAuth, (req, res) => {
  res.json({ codeId: req.session.codeId, name: req.session.name, role: req.session.role });
});

// ══════════════════════════════════════════════════════════════
// USER DATA
// ══════════════════════════════════════════════════════════════

app.get('/api/user/data', requireAuth, async (req, res) => {
  const { codeId } = req.session;
  if (!codeId) return res.json({ data: null });

  const { data, error } = await supabaseAdmin
    .from('user_data').select('data').eq('code_id', codeId).single();

  if (error && error.code !== 'PGRST116') return res.status(500).json({ error: error.message });
  res.json({ data: data?.data || null });
});

app.post('/api/user/data', requireAuth, async (req, res) => {
  const { codeId } = req.session;
  if (!codeId) return res.status(400).json({ error: 'No codeId' });

  const { payload } = req.body;
  if (!payload) return res.status(400).json({ error: 'No payload' });

  const { error } = await supabaseAdmin
    .from('user_data')
    .upsert({ code_id: codeId, data: payload }, { onConflict: 'code_id' });

  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

// ══════════════════════════════════════════════════════════════
// ADMIN
// ══════════════════════════════════════════════════════════════

app.get('/api/admin/members', requireAuth, requireAdmin, async (req, res) => {
  const [{ data: codes }, { data: users }] = await Promise.all([
    supabaseAdmin.from('member_codes').select('*').order('created_at', { ascending: false }),
    supabaseAdmin.from('user_data').select('*').order('updated_at', { ascending: false }),
  ]);
  res.json({ codes: codes || [], users: users || [] });
});

app.post('/api/admin/members', requireAuth, requireAdmin, async (req, res) => {
  const { name } = req.body;
  const code = String(Math.floor(100000 + Math.random() * 900000));
  const { data, error } = await supabaseAdmin
    .from('member_codes').insert({ code, name: name?.trim() || '', is_active: true }).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ code: data.code, id: data.id, name: data.name });
});

app.patch('/api/admin/members/:id', requireAuth, requireAdmin, async (req, res) => {
  const update = {};
  if (req.body.is_active !== undefined) update.is_active = req.body.is_active;
  if (req.body.name !== undefined) update.name = req.body.name;
  const { error } = await supabaseAdmin.from('member_codes').update(update).eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

app.delete('/api/admin/members/:id', requireAuth, requireAdmin, async (req, res) => {
  const { error } = await supabaseAdmin.from('member_codes').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

// ══════════════════════════════════════════════════════════════
// AI FEATURES (1x per hari per user)
// ══════════════════════════════════════════════════════════════

async function callAI(messages, maxTokens = 1500) {
  const apiKey = process.env.OPENROUTER_KEY;
  if (!apiKey) throw new Error('OPENROUTER_KEY not set');
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://deenme.app',
      'X-Title': 'Deenme',
    },
    body: JSON.stringify({ model: MODEL, messages, max_tokens: maxTokens, temperature: 0.7 }),
  });
  const data = await res.json();
  return data.choices?.[0]?.message?.content || null;
}

app.post('/api/ai/journal', requireAuth, async (req, res) => {
  const { codeId } = req.session;
  if (checkAiLimit(codeId, 'journal'))
    return res.status(429).json({ error: 'rate_limit', message: 'Fitur Rapikan AI hanya 1x per hari.' });

  const { text } = req.body;
  if (!text || text.length < 10) return res.status(400).json({ error: 'Teks terlalu singkat' });

  try {
    const result = await callAI([
      { role: 'system', content: `Kamu adalah asisten jurnal pribadi Muslim yang bertugas merapikan dan memperindah catatan harian.\n\nTugasmu:\n1. Perbaiki diksi dan tata bahasa Indonesia (santai tapi tetap elegan)\n2. Strukturkan dengan markdown: gunakan ## untuk heading utama, ### untuk sub-heading jika perlu\n3. Pisahkan paragraf dengan baik\n4. Pertahankan makna, suasana, dan kesan personal dari tulisan asli — jangan ubah fakta atau perasaan\n5. Jika ada ungkapan Arab/doa, pertahankan dengan benar\n6. Jangan tambahkan konten yang tidak ada di tulisan asli\n7. Mulai langsung dengan konten, tanpa pengantar atau penjelasan apapun\n8. Output hanya markdown, tidak ada komentar tambahan` },
      { role: 'user', content: text },
    ], 2000);
    if (!result) return res.status(500).json({ error: 'No response' });
    markAiUsed(codeId, 'journal');
    res.json({ result });
  } catch {
    res.status(500).json({ error: 'AI request failed' });
  }
});

app.post('/api/ai/dream', requireAuth, async (req, res) => {
  const { codeId } = req.session;
  if (checkAiLimit(codeId, 'dream'))
    return res.status(429).json({ error: 'rate_limit', message: 'Tafsir Mimpi hanya 1x per hari.' });

  const { text } = req.body;
  if (!text || text.length < 10) return res.status(400).json({ error: 'Cerita terlalu singkat' });

  try {
    const result = await callAI([
      { role: 'system', content: `Kamu adalah ahli tafsir mimpi Islam yang menguasai kitab Tafsir Al-Ahlam karya Ibnu Sirin, serta memahami psikologi modern tentang mimpi (Jung, Freud, neurosains mimpi).\n\nTugas kamu: tafsirkan mimpi yang diceritakan user dengan pendekatan:\n1. **Perspektif Islam** — berdasarkan kitab tafsir mimpi ulama (terutama Ibnu Sirin dan Al-Nabulsi). Sebutkan referensi kitab jika relevan.\n2. **Perspektif Psikologi Modern** — apa yang mungkin disampaikan alam bawah sadar.\n3. **Nasihat & Amalan** — anjuran amalan atau doa yang relevan setelah mimpi tersebut.\n\nFormat jawaban dalam Markdown yang rapi. Panjang jawaban: 300-500 kata. Jangan membuat klaim pasti tentang takdir — ini hanya tafsir, bukan ramalan.` },
      { role: 'user', content: `Mimpi saya: ${text}` },
    ]);
    if (!result) return res.status(500).json({ error: 'No response' });
    markAiUsed(codeId, 'dream');
    res.json({ result });
  } catch {
    res.status(500).json({ error: 'AI request failed' });
  }
});

app.post('/api/ai/doa', requireAuth, async (req, res) => {
  const { codeId } = req.session;
  if (checkAiLimit(codeId, 'doa'))
    return res.status(429).json({ error: 'rate_limit', message: 'Cari Doa AI hanya 1x per hari.' });

  const { situasi } = req.body;
  if (!situasi || situasi.length < 3) return res.status(400).json({ error: 'Cerita terlalu singkat' });

  try {
    const result = await callAI([
      { role: 'system', content: `Kamu adalah asisten Muslim yang membantu menemukan doa yang paling tepat berdasarkan situasi yang dialami user.\n\nDari cerita atau situasi yang disampaikan user, rekomendasikan 2-3 doa yang paling relevan.\n\nFormat output JSON array seperti ini (tidak ada teks lain selain JSON):\n[\n  {\n    "name": "Nama Doa",\n    "ar": "النص العربي",\n    "latin": "teks latin",\n    "arti": "artinya dalam bahasa Indonesia",\n    "alasan": "kenapa doa ini cocok untuk situasimu",\n    "sumber": "HR. Bukhari no. XXXX"\n  }\n]\n\nJawab HANYA dengan JSON array. Tidak ada penjelasan, tidak ada kalimat pembuka.` },
      { role: 'user', content: situasi },
    ], 1200);
    const clean = (result || '').replace(/```json|```/g, '').trim();
    const doas = JSON.parse(clean);
    markAiUsed(codeId, 'doa');
    res.json({ doas });
  } catch {
    res.status(500).json({ error: 'AI request failed' });
  }
});

// ── Dream Tafsir history ────────────────────────────────────────
app.get('/api/dreams', requireAuth, async (req, res) => {
  const { codeId } = req.session;
  const { data } = await supabaseAdmin
    .from('dream_tafsir').select('*').eq('code_id', codeId)
    .order('created_at', { ascending: false }).limit(20);
  res.json({ dreams: data || [] });
});

app.post('/api/dreams', requireAuth, async (req, res) => {
  const { codeId } = req.session;
  const { dream_text, tafsir_result } = req.body;
  const { data, error } = await supabaseAdmin
    .from('dream_tafsir').insert({ code_id: codeId, dream_text, tafsir_result }).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ dream: data });
});

app.delete('/api/dreams/:id', requireAuth, async (req, res) => {
  await supabaseAdmin.from('dream_tafsir').delete().eq('id', req.params.id);
  res.json({ ok: true });
});

const PORT = process.env.API_PORT || 3001;
app.listen(PORT, '0.0.0.0', () => console.log(`Deenme API running on port ${PORT}`));
