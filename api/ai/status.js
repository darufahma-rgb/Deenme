import { requireAuth } from '../_lib/auth.js';
import { getAiUsageToday } from '../_lib/aiLimit.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const session = requireAuth(req, res);
  if (!session) return;

  const usage = await getAiUsageToday(session.codeId);

  const features = ['dream', 'journal', 'doa'];
  const status = {};
  features.forEach(f => {
    const used = usage.find(u => u.feature === f);
    status[f] = {
      used: !!used,
      usedAt: used?.used_at || null,
    };
  });

  return res.json({ status });
}
