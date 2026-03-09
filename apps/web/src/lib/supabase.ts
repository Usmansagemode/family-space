import { initSupabase, getSupabaseClient } from '@family/supabase'

initSupabase(
  import.meta.env['VITE_SUPABASE_URL'] as string | undefined,
  import.meta.env['VITE_SUPABASE_ANON_KEY'] as string | undefined,
)

// Re-export for any code that still imports { supabase } from '#/lib/supabase'
export const supabase = getSupabaseClient()
