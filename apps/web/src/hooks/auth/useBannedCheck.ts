import { useEffect, useState } from 'react'
import { supabase } from '#/lib/supabase'

/**
 * Checks if the signed-in user has been banned (profiles.banned_at IS NOT NULL).
 * If banned, signs out immediately and sets `banned = true`.
 * Called once per session from AuthedLayout.
 */
export function useBannedCheck(userId: string | undefined): { banned: boolean; banReason: string | null } {
  const [banned, setBanned] = useState(false)
  const [banReason, setBanReason] = useState<string | null>(null)

  useEffect(() => {
    if (!userId || !supabase) return

    supabase
      .from('profiles')
      .select('banned_at, ban_reason')
      .eq('id', userId)
      .single()
      .then(({ data }) => {
        const row = data as { banned_at: string | null; ban_reason: string | null } | null
        if (row?.banned_at) {
          setBanned(true)
          setBanReason(row.ban_reason)
          // Sign out the banned user — they should not retain a session
          supabase?.auth.signOut()
        }
      })
  }, [userId])

  return { banned, banReason }
}
