import { supabase } from '../_lib/supabase.js';
import { requireAuth } from '../_lib/auth.js';

export default async function handler(req, res) {
  const session = requireAuth(req, res);
  if (!session) return;

  if (req.method === 'DELETE') {
    const { id } = req.query;
    const { error } = await supabase
      .from('dream_tafsir')
      .delete()
      .eq('id', id)
      .eq('code_id', session.codeId);
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ ok: true });
  }

  res.status(405).end();
}
