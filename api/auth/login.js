import { supabase } from '../_lib/supabase.js';
import { createToken } from '../_lib/session.js';

const attempts = {};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  const now = Date.now();
  attempts[ip] = (attempts[ip] || []).filter(t => now - t < 15 * 60 * 1000);
  if (attempts[ip].length >= 10) {
    return res.status(429).json({ error: 'rate_limit', message: 'Terlalu banyak percobaan. Tunggu 15 menit.' });
  }
  attempts[ip].push(now);

  const { code } = req.body;
  if (!code) return res.status(400).json({ error: 'Kode tidak valid' });
  const clean = String(code).trim();

  if (clean.length === 12) {
    const { data } = await supabase.from('admin_codes').select('id').eq('code', clean).single();
    if (!data) return res.status(401).json({ error: 'Kode admin tidak valid' });
    const token = createToken({ role: 'admin', codeId: null, name: 'Admin' });
    return res.json({ token, name: 'Admin', role: 'admin', codeId: null });
  }

  if (!/^\d{6}$/.test(clean)) return res.status(400).json({ error: 'Format kode tidak valid' });

  const { data, error } = await supabase
    .from('member_codes').select('id, name, is_active').eq('code', clean).single();

  if (error || !data) return res.status(401).json({ error: 'Kode tidak ditemukan' });
  if (!data.is_active) return res.status(403).json({ error: 'Kode tidak aktif. Hubungi admin.' });

  const token = createToken({ role: 'member', codeId: data.id, name: data.name || 'Akhi' });
  return res.json({ token, name: data.name || 'Akhi', role: 'member', codeId: data.id });
}
