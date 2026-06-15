import { requireAuth } from '../_lib/auth.js';

const dailyUsage = {};
const today = () => new Date().toISOString().slice(0, 10);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const session = requireAuth(req, res);
  if (!session) return;

  const { codeId } = session;
  if (dailyUsage[codeId] === today()) {
    return res.status(429).json({ error: 'rate_limit', message: 'Tafsir Mimpi hanya 1x per hari. Coba lagi besok.' });
  }

  const { text } = req.body;
  if (!text || text.length < 10) return res.status(400).json({ error: 'Cerita terlalu singkat' });

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
          { role: 'system', content: 'Kamu adalah ahli tafsir mimpi Islam yang menguasai kitab Tafsir Al-Ahlam karya Ibnu Sirin, serta memahami psikologi modern tentang mimpi (Jung, Freud, neurosains mimpi).\n\nTugas kamu: tafsirkan mimpi yang diceritakan user dengan pendekatan:\n1. **Perspektif Islam** — berdasarkan kitab tafsir mimpi ulama (terutama Ibnu Sirin dan Al-Nabulsi). Sebutkan referensi kitab jika relevan.\n2. **Perspektif Psikologi Modern** — apa yang mungkin disampaikan alam bawah sadar.\n3. **Nasihat & Amalan** — anjuran amalan atau doa yang relevan setelah mimpi tersebut.\n\nFormat jawaban dalam Markdown yang rapi. Panjang jawaban: 300-500 kata. Jangan membuat klaim pasti tentang takdir — ini hanya tafsir, bukan ramalan.' },
          { role: 'user', content: `Mimpi saya: ${text}` },
        ],
        max_tokens: 1500,
      }),
    });
    const data = await response.json();
    const result = data.choices?.[0]?.message?.content;
    if (!result) return res.status(500).json({ error: 'No response' });
    dailyUsage[codeId] = today();
    res.json({ result });
  } catch {
    res.status(500).json({ error: 'AI request failed' });
  }
}
