import { createClient } from '@supabase/supabase-js';
import { verifyToken } from '../../_lib/session.js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  const session = verifyToken(req.headers['x-session-token']);
  if (!session || session.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });

  const { id } = req.query;

  if (req.method === 'PATCH') {
    const update = {};
    if (req.body.is_active !== undefined) update.is_active = req.body.is_active;
    if (req.body.name !== undefined) update.name = req.body.name;
    const { error } = await supabase.from('member_codes').update(update).eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ ok: true });
  }

  if (req.method === 'DELETE') {
    const { error } = await supabase.from('member_codes').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ ok: true });
  }

  res.status(405).end();
}
