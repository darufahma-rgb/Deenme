import { verifyToken } from '../_lib/session.js';

export default function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  const session = verifyToken(req.headers['x-session-token']);
  if (!session) return res.status(401).json({ error: 'Unauthorized' });
  res.json({ codeId: session.codeId, name: session.name, role: session.role });
}
