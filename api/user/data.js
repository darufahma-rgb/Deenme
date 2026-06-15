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
    if (!codeId) return res.json({ data: null });
    const { data, error } = await supabase
      .from('user_data').select('data').eq('code_id', codeId).single();
    if (error && error.code !== 'PGRST116') return res.status(500).json({ error: error.message });
    return res.json({ data: data?.data || null });
  }

  if (req.method === 'POST') {
    if (!codeId) return res.status(400).json({ error: 'No codeId' });
    const { payload } = req.body;
    if (!payload) return res.status(400).json({ error: 'No payload' });
    const { error } = await supabase
      .from('user_data')
      .upsert({ code_id: codeId, data: payload }, { onConflict: 'code_id' });
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ ok: true });
  }

  res.status(405).end();
}
