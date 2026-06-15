import crypto from 'crypto';

export function createToken(payload) {
  const data = Buffer.from(JSON.stringify({ ...payload, iat: Date.now() })).toString('base64url');
  const sig = crypto
    .createHmac('sha256', process.env.SUPABASE_SERVICE_KEY)
    .update(data)
    .digest('hex');
  return `${data}.${sig}`;
}

export function verifyToken(token) {
  if (!token) return null;
  const dot = token.lastIndexOf('.');
  if (dot < 0) return null;
  const data = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = crypto
    .createHmac('sha256', process.env.SUPABASE_SERVICE_KEY)
    .update(data)
    .digest('hex');
  try {
    if (
      sig.length !== expected.length ||
      !crypto.timingSafeEqual(Buffer.from(sig, 'hex'), Buffer.from(expected, 'hex'))
    ) return null;
    const parsed = JSON.parse(Buffer.from(data, 'base64url').toString());
    if (Date.now() - parsed.iat > 30 * 24 * 60 * 60 * 1000) return null;
    return parsed;
  } catch { return null; }
}
