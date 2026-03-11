import type { Family, FamilyMember } from '@family/types'
import { getSupabaseClient } from './client'

export type { Family, FamilyMember }

function mapFamily(data: {
  id: string
  name: string
  google_calendar_id: string | null
  google_calendar_embed_url?: string | null
  created_at: string
}): Family {
  return {
    id: data.id,
    name: data.name,
    googleCalendarId: data.google_calendar_id ?? undefined,
    googleCalendarEmbedUrl: data.google_calendar_embed_url ?? undefined,
    createdAt: new Date(data.created_at),
  }
}

export async function fetchFamily(id: string): Promise<Family> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('families')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return mapFamily(data)
}

export async function updateFamily(
  id: string,
  input: {
    name?: string
    googleCalendarId?: string
    googleCalendarEmbedUrl?: string
  },
): Promise<Family> {
  const supabase = getSupabaseClient()
  const dbInput: Record<string, unknown> = {}
  if (input.name !== undefined) dbInput['name'] = input.name
  if (input.googleCalendarId !== undefined)
    dbInput['google_calendar_id'] = input.googleCalendarId || null
  if (input.googleCalendarEmbedUrl !== undefined)
    dbInput['google_calendar_embed_url'] = input.googleCalendarEmbedUrl || null

  const { data, error } = await supabase
    .from('families')
    .update(dbInput)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return mapFamily(data)
}

export async function findFamily(userId: string): Promise<Family | null> {
  const supabase = getSupabaseClient()
  const { data: membership } = await supabase
    .from('user_families')
    .select('family_id, families(*)')
    .eq('user_id', userId)
    .limit(1)
    .maybeSingle()

  if (!membership?.families) return null
  return mapFamily(membership.families as unknown as Parameters<typeof mapFamily>[0])
}

export async function fetchFamilyMembers(
  familyId: string,
): Promise<FamilyMember[]> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('user_families')
    .select('user_id, role, profiles(name, email, avatar_url)')
    .eq('family_id', familyId)

  if (error) throw error

  return data.map((row) => {
    const profile = row.profiles as unknown as {
      name: string | null
      email: string | null
      avatar_url: string | null
    } | null
    return {
      userId: row.user_id as string,
      role: row.role as 'owner' | 'member',
      name: profile?.name ?? null,
      email: profile?.email ?? null,
      avatarUrl: profile?.avatar_url ?? null,
    }
  })
}

export async function removeFamilyMember(
  familyId: string,
  userId: string,
): Promise<void> {
  const supabase = getSupabaseClient()
  const { error, count } = await supabase
    .from('user_families')
    .delete({ count: 'exact' })
    .eq('family_id', familyId)
    .eq('user_id', userId)

  if (error) throw error
  if (count === 0)
    throw new Error('Delete blocked — check RLS policy on user_families')
}

export async function findOrCreateFamily(userId: string): Promise<Family> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.rpc('find_or_create_family', {
    p_user_id: userId,
  })

  if (error) throw error
  return mapFamily(data as Parameters<typeof mapFamily>[0])
}
