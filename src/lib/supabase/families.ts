import { isDemoMode, supabase } from '#/lib/supabase'
import { DEMO_FAMILY_ID } from '#/lib/config'

export type FamilyMember = {
  userId: string
  role: 'owner' | 'member'
  name: string | null
  email: string | null
  avatarUrl: string | null
}

export type Family = {
  id: string
  name: string
  googleCalendarId?: string
  googleCalendarEmbedUrl?: string
  createdAt: Date
}

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms))

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
  if (isDemoMode) {
    await delay()
    return { id, name: 'Our Family', createdAt: new Date() }
  }

  const { data, error } = await supabase!
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
  if (isDemoMode) {
    await delay()
    return {
      id,
      name: input.name ?? 'Our Family',
      googleCalendarId: input.googleCalendarId,
      googleCalendarEmbedUrl: input.googleCalendarEmbedUrl,
      createdAt: new Date(),
    }
  }

  const dbInput: Record<string, unknown> = {}
  if (input.name !== undefined) dbInput['name'] = input.name
  if (input.googleCalendarId !== undefined)
    dbInput['google_calendar_id'] = input.googleCalendarId || null
  if (input.googleCalendarEmbedUrl !== undefined)
    dbInput['google_calendar_embed_url'] = input.googleCalendarEmbedUrl || null

  const { data, error } = await supabase!
    .from('families')
    .update(dbInput)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return mapFamily(data)
}

export async function findFamily(userId: string): Promise<Family | null> {
  if (isDemoMode) {
    await delay()
    return { id: DEMO_FAMILY_ID, name: 'Our Family', createdAt: new Date() }
  }

  const { data: membership } = await supabase!
    .from('user_families')
    .select('family_id, families(*)')
    .eq('user_id', userId)
    .order('joined_at', { ascending: true })
    .limit(1)
    .maybeSingle()

  if (!membership?.families) return null
  return mapFamily(membership.families as Parameters<typeof mapFamily>[0])
}

export async function fetchFamilyMembers(
  familyId: string,
): Promise<FamilyMember[]> {
  if (isDemoMode) {
    await delay()
    return [
      {
        userId: 'demo-user',
        role: 'owner',
        name: 'You',
        email: 'you@example.com',
        avatarUrl: null,
      },
    ]
  }

  const { data, error } = await supabase!
    .from('user_families')
    .select('user_id, role, profiles(name, email, avatar_url)')
    .eq('family_id', familyId)
    .order('joined_at', { ascending: true })

  if (error) throw error

  return (data ?? []).map((row) => {
    const profile = row.profiles as {
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
  if (isDemoMode) {
    await delay()
    return
  }

  const { error } = await supabase!
    .from('user_families')
    .delete()
    .eq('family_id', familyId)
    .eq('user_id', userId)

  if (error) throw error
}

export async function findOrCreateFamily(userId: string): Promise<Family> {
  if (isDemoMode) {
    await delay()
    return { id: DEMO_FAMILY_ID, name: 'Our Family', createdAt: new Date() }
  }

  // Find existing family via user_families join table
  const { data: membership } = await supabase!
    .from('user_families')
    .select('family_id, families(*)')
    .eq('user_id', userId)
    .order('joined_at', { ascending: true })
    .limit(1)
    .maybeSingle()

  if (membership?.families) return mapFamily(membership.families as Parameters<typeof mapFamily>[0])

  // No family yet — create one and insert owner membership
  const { data: created, error } = await supabase!
    .from('families')
    .insert({ name: 'Our Family' })
    .select()
    .single()

  if (error) throw error

  await supabase!
    .from('user_families')
    .insert({ user_id: userId, family_id: created.id, role: 'owner' })

  return mapFamily(created)
}
