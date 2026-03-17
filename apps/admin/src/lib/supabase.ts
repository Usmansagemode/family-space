import { initSupabase, getSupabaseClient } from '@family/supabase'

// Service role key — bypasses RLS for cross-family admin queries
initSupabase(
  import.meta.env['VITE_SUPABASE_URL'] as string,
  import.meta.env['VITE_SUPABASE_SERVICE_KEY'] as string,
)

export const supabase = getSupabaseClient()
