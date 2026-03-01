import { isDemoMode, supabase } from '#/lib/supabase'
import { DEMO_FAMILY_ID } from '#/lib/config'

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
  input: { name?: string; googleCalendarId?: string; googleCalendarEmbedUrl?: string },
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

export async function findOrCreateFamily(userId: string): Promise<Family> {
  if (isDemoMode) {
    await delay()
    return { id: DEMO_FAMILY_ID, name: 'Our Family', createdAt: new Date() }
  }

  // Find existing family owned by this user
  const { data: existing } = await supabase!
    .from('families')
    .select('*')
    .eq('owner_user_id', userId)
    .maybeSingle()

  if (existing) return mapFamily(existing)

  // No family yet — create one
  const { data: created, error } = await supabase!
    .from('families')
    .insert({ name: 'Our Family', owner_user_id: userId })
    .select()
    .single()

  if (error) throw error
  return mapFamily(created)
}
