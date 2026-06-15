import { requireAuth } from '../_lib/auth.js';

export default function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  const session = requireAuth(req, res);
  if (!session) return;
  res.json({ codeId: session.codeId, name: session.name, role: session.role });
}
