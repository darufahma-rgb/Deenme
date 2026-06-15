import { requireAuth } from '../_lib/auth.js';
import { checkAiLimit, markAiUsed } from '../_lib/aiLimit.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const session = requireAuth(req, res);
  if (!session) return;

  const { codeId } = session;

  const isLimited = await checkAiLimit(codeId, 'journal');
  if (isLimited) {
    return res.status(429).json({ error: 'rate_limit', message: 'Rapikan AI hanya 1x per hari. Coba lagi besok.' });
  }

  const { text } = req.body;
  if (!text || text.length < 10) return res.status(400).json({ error: 'Teks terlalu singkat' });

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
          { role: 'system', content: 'Kamu adalah asisten jurnal pribadi Muslim yang bertugas merapikan dan memperindah catatan harian.\n\nTugasmu:\n1. Perbaiki diksi dan tata bahasa Indonesia (santai tapi tetap elegan)\n2. Strukturkan dengan markdown: gunakan ## untuk heading utama, ### untuk sub-heading jika perlu\n3. Pisahkan paragraf dengan baik\n4. Pertahankan makna, suasana, dan kesan personal dari tulisan asli — jangan ubah fakta atau perasaan\n5. Jika ada ungkapan Arab/doa, pertahankan dengan benar\n6. Jangan tambahkan konten yang tidak ada di tulisan asli\n7. Mulai langsung dengan konten, tanpa pengantar atau penjelasan apapun\n8. Output hanya markdown, tidak ada komentar tambahan' },
          { role: 'user', content: text },
        ],
        max_tokens: 2000,
      }),
    });
    const data = await response.json();
    const result = data.choices?.[0]?.message?.content;
    if (!result) return res.status(500).json({ error: 'No response' });
    await markAiUsed(codeId, 'journal');
    return res.json({ result });
  } catch {
    return res.status(500).json({ error: 'AI request failed' });
  }
}
