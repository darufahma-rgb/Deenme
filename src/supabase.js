import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://uhpsopminpewirkmloiv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVocHNvcG1pbnBld2lya21sb2l2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzMzMyMDcsImV4cCI6MjA5NjkwOTIwN30.lZ4ninMMzqdsIQcYXwywAuy70jU2B-CbiWc2XXKzv2w'
);
