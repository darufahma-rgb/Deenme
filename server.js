import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/journal/enhance', async (req, res) => {
  const apiKey = process.env.OPENROUTER_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: 'AI feature not configured' });
  }

  const { text } = req.body;
  if (!text || text.length < 10) {
    return res.status(400).json({ error: 'Text too short' });
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
        model: 'google/gemini-flash-1.5',
        messages: [
          {
            role: 'system',
            content: `Kamu adalah asisten jurnal pribadi Muslim yang bertugas merapikan dan memperindah catatan harian.\n\nTugasmu:\n1. Perbaiki diksi dan tata bahasa Indonesia (santai tapi tetap elegan)\n2. Strukturkan dengan markdown: gunakan ## untuk heading utama, ### untuk sub-heading jika perlu\n3. Pisahkan paragraf dengan baik\n4. Pertahankan makna, suasana, dan kesan personal dari tulisan asli — jangan ubah fakta atau perasaan\n5. Jika ada ungkapan Arab/doa, pertahankan dengan benar\n6. Jangan tambahkan konten yang tidak ada di tulisan asli\n7. Mulai langsung dengan konten, tanpa pengantar atau penjelasan apapun\n8. Output hanya markdown, tidak ada komentar tambahan`,
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
      res.json({ result });
    } else {
      res.status(500).json({ error: 'No response from AI' });
    }
  } catch (err) {
    console.error('OpenRouter error:', err);
    res.status(500).json({ error: 'AI request failed' });
  }
});

app.post('/api/dream/tafsir', async (req, res) => {
  const apiKey = process.env.OPENROUTER_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: 'AI feature not configured' });
  }

  const { text } = req.body;
  if (!text || text.length < 10) {
    return res.status(400).json({ error: 'Text too short' });
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
        model: 'google/gemini-flash-1.5',
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
- Awali dengan bismillah dalam Arab jika relevan
- Jangan membuat klaim pasti tentang takdir — ini hanya tafsir, bukan ramalan
- Tafsir mengacu pada kitab Mukhtasar Al-Ru'ya karya Ibnu Sirin dan pendekatan psikologi analitik Carl Jung

Jika cerita mimpi terlalu singkat atau tidak jelas, minta user untuk menceritakan lebih detail.`,
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
      res.json({ result });
    } else {
      res.status(500).json({ error: 'No response from AI' });
    }
  } catch (err) {
    console.error('OpenRouter dream tafsir error:', err);
    res.status(500).json({ error: 'AI request failed' });
  }
});

const PORT = process.env.API_PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`API server running on port ${PORT}`);
});
