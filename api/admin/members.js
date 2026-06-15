import { supabase } from '../_lib/supabase.js';
import { requireAdmin } from '../_lib/auth.js';

export default async function handler(req, res) {
  const session = requireAdmin(req, res);
  if (!session) return;

  if (req.method === 'GET') {
    const [{ data: codes }, { data: users }, { data: dreams }] = await Promise.all([
      supabase.from('member_codes').select('*').order('created_at', { ascending: false }),
      supabase.from('user_data').select('*').order('updated_at', { ascending: false }),
      supabase.from('dream_tafsir').select('id, code_id, dream_text, created_at')
        .order('created_at', { ascending: false }).limit(100),
    ]);
    return res.json({ codes: codes || [], users: users || [], dreams: dreams || [] });
  }

  if (req.method === 'POST') {
    const { name } = req.body;
    const code = String(Math.floor(100000 + Math.random() * 900000));
    const { data, error } = await supabase
      .from('member_codes').insert({ code, name: name?.trim() || '', is_active: true }).select().single();
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ code: data.code, id: data.id, name: data.name });
  }

  res.status(405).end();
}
