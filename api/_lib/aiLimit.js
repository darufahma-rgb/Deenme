import { supabase } from './supabase.js';

/**
 * Cek apakah codeId sudah pakai fitur AI hari ini
 * @returns {boolean} true = sudah pakai (blokir), false = belum (izinkan)
 */
export async function checkAiLimit(codeId, feature) {
  if (!codeId) return false;

  const today = new Date().toISOString().slice(0, 10);

  const { data } = await supabase
    .from('ai_usage')
    .select('id')
    .eq('code_id', codeId)
    .eq('feature', feature)
    .eq('used_date', today)
    .maybeSingle();

  return !!data;
}

/**
 * Tandai codeId sudah pakai fitur AI hari ini
 */
export async function markAiUsed(codeId, feature) {
  if (!codeId) return;

  const today = new Date().toISOString().slice(0, 10);

  await supabase
    .from('ai_usage')
    .upsert(
      { code_id: codeId, feature, used_date: today },
      { onConflict: 'code_id,feature,used_date' }
    );
}

/**
 * Ambil info penggunaan AI hari ini untuk satu member
 */
export async function getAiUsageToday(codeId) {
  if (!codeId) return [];

  const today = new Date().toISOString().slice(0, 10);

  const { data } = await supabase
    .from('ai_usage')
    .select('feature, used_at')
    .eq('code_id', codeId)
    .eq('used_date', today);

  return data || [];
}
