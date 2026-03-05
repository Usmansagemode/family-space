import { supabase } from '#/lib/supabase'

export type InviteInfo = {
  familyId: string
  familyName: string
}

export async function createInvite(familyId: string): Promise<string> {
  const { data, error } = await supabase!
    .from('invites')
    .insert({ family_id: familyId })
    .select('token')
    .single()

  if (error) throw error
  return data.token as string
}

export async function getInviteByToken(
  token: string,
): Promise<InviteInfo | null> {
  const { data, error } = await supabase!
    .from('invites')
    .select('family_id, accepted_at, families(name)')
    .eq('token', token)
    .maybeSingle()

  if (error || !data) return null
  if (data.accepted_at) return null // already accepted

  return {
    familyId: data.family_id as string,
    familyName: (data.families as { name: string } | null)?.name ?? 'Family',
  }
}

export async function acceptInvite(
  token: string,
  userId: string,
  familyId: string,
): Promise<void> {
  // Add user to the family (upsert in case they're already a member)
  const { error: memberError } = await supabase!
    .from('user_families')
    .upsert(
      { user_id: userId, family_id: familyId, role: 'member' },
      { onConflict: 'user_id,family_id' },
    )

  if (memberError) throw memberError

  // Mark invite as accepted
  await supabase!
    .from('invites')
    .update({ accepted_at: new Date().toISOString() })
    .eq('token', token)
}
