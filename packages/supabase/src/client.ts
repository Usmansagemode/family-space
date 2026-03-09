import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let _client: SupabaseClient | null = null

export function initSupabase(
  url: string | undefined,
  key: string | undefined,
): void {
  if (!url || !key) {
    throw new Error(
      'Missing Supabase URL or anon key — add them to your .env file.',
    )
  }
  _client = createClient(url, key)
}

export function getSupabaseClient(): SupabaseClient {
  if (!_client) {
    throw new Error('Supabase not initialized — call initSupabase() first.')
  }
  return _client
}
