import { createClient } from '@supabase/supabase-js';
import { verifyToken } from '../_lib/session.js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  const session = verifyToken(req.headers['x-session-token']);
  if (!session) return res.status(401).json({ error: 'Unauthorized' });

  if (req.method === 'DELETE') {
    await supabase.from('dream_tafsir').delete().eq('id', req.query.id);
    return res.json({ ok: true });
  }

  res.status(405).end();
}
