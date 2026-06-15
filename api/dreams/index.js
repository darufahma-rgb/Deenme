import { createClient } from '@supabase/supabase-js';
import { verifyToken } from '../_lib/session.js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  const session = verifyToken(req.headers['x-session-token']);
  if (!session) return res.status(401).json({ error: 'Unauthorized' });
  const { codeId } = session;

  if (req.method === 'GET') {
    const { data } = await supabase
      .from('dream_tafsir').select('*').eq('code_id', codeId)
      .order('created_at', { ascending: false }).limit(20);
    return res.json({ dreams: data || [] });
  }

  if (req.method === 'POST') {
    const { dream_text, tafsir_result } = req.body;
    const { data, error } = await supabase
      .from('dream_tafsir').insert({ code_id: codeId, dream_text, tafsir_result }).select().single();
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ dream: data });
  }

  res.status(405).end();
}
