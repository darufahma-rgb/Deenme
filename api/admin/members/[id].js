import { supabase } from '../../_lib/supabase.js';
import { requireAdmin } from '../../_lib/auth.js';

export default async function handler(req, res) {
  const session = requireAdmin(req, res);
  if (!session) return;

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
