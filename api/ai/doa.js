import { requireAuth } from '../_lib/auth.js';

const dailyUsage = {};
const today = () => new Date().toISOString().slice(0, 10);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const session = requireAuth(req, res);
  if (!session) return;

  const { codeId } = session;
  if (dailyUsage[codeId] === today()) {
    return res.status(429).json({ error: 'rate_limit', message: 'Cari Doa AI hanya 1x per hari. Coba lagi besok.' });
  }

  const { situasi } = req.body;
  if (!situasi || situasi.length < 3) return res.status(400).json({ error: 'Cerita terlalu singkat' });

  const apiKey = process.env.OPENROUTER_KEY;
  if (!apiKey) return res.status(503).json({ error: 'AI not configured' });

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://deenme.app',
        'X-Title': 'Deenme',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-sonnet-4-5',
        messages: [
          { role: 'system', content: 'Kamu adalah asisten Muslim yang membantu menemukan doa yang paling tepat berdasarkan situasi yang dialami user.\n\nDari cerita atau situasi yang disampaikan user, rekomendasikan 2-3 doa yang paling relevan.\n\nFormat output JSON array seperti ini (tidak ada teks lain selain JSON):\n[\n  {\n    "name": "Nama Doa",\n    "ar": "النص العربي",\n    "latin": "teks latin",\n    "arti": "artinya dalam bahasa Indonesia",\n    "alasan": "kenapa doa ini cocok untuk situasimu",\n    "sumber": "HR. Bukhari no. XXXX"\n  }\n]\n\nJawab HANYA dengan JSON array. Tidak ada penjelasan, tidak ada kalimat pembuka.' },
          { role: 'user', content: situasi },
        ],
        max_tokens: 1200,
      }),
    });
    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content;
    if (!raw) return res.status(500).json({ error: 'No response' });
    const clean = raw.replace(/```json|```/g, '').trim();
    const doas = JSON.parse(clean);
    dailyUsage[codeId] = today();
    res.json({ doas });
  } catch {
    res.status(500).json({ error: 'AI request failed' });
  }
}
