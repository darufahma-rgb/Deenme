import { supabase } from '../_lib/supabase.js';
import { requireAuth } from '../_lib/auth.js';

export default async function handler(req, res) {
  const session = requireAuth(req, res);
  if (!session) return;

  const { codeId } = session;
  if (!codeId) return res.status(400).json({ error: 'No codeId' });

  if (req.method === 'GET') {
    const { data } = await supabase
      .from('dream_tafsir')
      .select('*')
      .eq('code_id', codeId)
      .order('created_at', { ascending: false })
      .limit(20);
    return res.json({ dreams: data || [] });
  }

  if (req.method === 'POST') {
    const { dream_text, tafsir_result } = req.body;
    if (!dream_text || !tafsir_result) return res.status(400).json({ error: 'Missing fields' });
    const { data, error } = await supabase
      .from('dream_tafsir')
      .insert({ code_id: codeId, dream_text, tafsir_result })
      .select().single();
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ dream: data });
  }

  res.status(405).end();
}
