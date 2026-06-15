import { createClient } from '@supabase/supabase-js';
import { verifyToken } from '../_lib/session.js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  const session = verifyToken(req.headers['x-session-token']);
  if (!session || session.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });

  if (req.method === 'GET') {
    const [{ data: codes }, { data: users }] = await Promise.all([
      supabase.from('member_codes').select('*').order('created_at', { ascending: false }),
      supabase.from('user_data').select('*').order('updated_at', { ascending: false }),
    ]);
    return res.json({ codes: codes || [], users: users || [] });
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
