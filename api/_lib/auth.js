import { verifyToken } from './session.js';

export function getSession(req) {
  return verifyToken(req.headers['x-session-token']);
}

export function requireAuth(req, res) {
  const session = getSession(req);
  if (!session) { res.status(401).json({ error: 'Unauthorized' }); return null; }
  return session;
}

export function requireAdmin(req, res) {
  const session = getSession(req);
  if (!session || session.role !== 'admin') {
    res.status(403).json({ error: 'Forbidden' });
    return null;
  }
  return session;
}
