import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let _client: SupabaseClient | null = null

export function initSupabase(
  url: string | undefined,
  key: string | undefined,
): boolean {
  if (!url || !key) {
    console.warn(
      '[family-app] Missing Supabase credentials — database features will be unavailable. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.',
    )
    return false
  }
  _client = createClient(url, key)
  return true
}

export function getSupabaseClient(): SupabaseClient {
  if (!_client) {
    throw new Error('Supabase not initialized — call initSupabase() first.')
  }
  return _client
}
