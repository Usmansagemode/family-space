import type { Item, Recurrence } from '@family/types'
import { getSupabaseClient } from './client'

function rowToItem(row: {
  id: string
  family_id?: string | null
  space_id: string
  title: string
  description: string | null
  quantity: string | null
  start_date: string | null
  end_date: string | null
  recurrence: string | null
  completed: boolean
  completed_at: string | null
  google_event_id: string | null
  sort_order: number
  created_at: string
  updated_at: string
}): Item {
  return {
    id: row.id,
    familyId: row.family_id ?? undefined,
    spaceId: row.space_id,
    title: row.title,
    description: row.description ?? undefined,
    quantity: row.quantity ?? undefined,
    startDate: row.start_date ? new Date(row.start_date) : undefined,
    endDate: row.end_date ? new Date(row.end_date) : undefined,
    recurrence: row.recurrence as Recurrence | undefined,
    completed: row.completed,
    completedAt: row.completed_at ? new Date(row.completed_at) : undefined,
    googleEventId: row.google_event_id ?? undefined,
    sortOrder: row.sort_order,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  }
}

export async function fetchItems(spaceId: string): Promise<Item[]> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('items')
    .select('*')
    .eq('space_id', spaceId)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })

  if (error) throw error
  return data.map(rowToItem)
}

export async function createItem(input: {
  familyId: string
  spaceId: string
  title: string
  description?: string
  quantity?: string
  startDate?: Date
  endDate?: Date
  recurrence?: Recurrence
  googleEventId?: string
}): Promise<Item> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('items')
    .insert({
      family_id: input.familyId,
      space_id: input.spaceId,
      title: input.title,
      description: input.description ?? null,
      quantity: input.quantity ?? null,
      start_date: input.startDate?.toISOString() ?? null,
      end_date: input.endDate?.toISOString() ?? null,
      recurrence: input.recurrence ?? null,
      google_event_id: input.googleEventId ?? null,
      sort_order: 0,
    })
    .select()
    .single()

  if (error) throw error
  return rowToItem(data)
}

export async function updateItem(
  id: string,
  input: Partial<{
    title: string
    description: string
    quantity: string | null
    startDate: Date
    endDate: Date
    recurrence: Recurrence | null
    googleEventId: string | null
  }>,
): Promise<Item> {
  const supabase = getSupabaseClient()
  const dbInput: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  }
  if (input.title !== undefined) dbInput['title'] = input.title
  if (input.description !== undefined)
    dbInput['description'] = input.description
  if (input.quantity !== undefined) dbInput['quantity'] = input.quantity
  if (input.startDate !== undefined)
    dbInput['start_date'] = input.startDate.toISOString()
  if (input.endDate !== undefined)
    dbInput['end_date'] = input.endDate.toISOString()
  if (input.recurrence !== undefined) dbInput['recurrence'] = input.recurrence
  if (input.googleEventId !== undefined)
    dbInput['google_event_id'] = input.googleEventId

  const { data, error } = await supabase
    .from('items')
    .update(dbInput)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return rowToItem(data)
}

export async function completeItem(id: string): Promise<Item> {
  const supabase = getSupabaseClient()
  const now = new Date().toISOString()
  const { data, error } = await supabase
    .from('items')
    .update({ completed: true, completed_at: now, updated_at: now })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return rowToItem(data)
}

export async function deleteItem(id: string): Promise<void> {
  const supabase = getSupabaseClient()
  const { error } = await supabase.from('items').delete().eq('id', id)
  if (error) throw error
}

export async function moveItem(id: string, newSpaceId: string): Promise<Item> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('items')
    .update({ space_id: newSpaceId, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return rowToItem(data)
}

export async function searchItems(
  spaceIds: string[],
  query: string,
): Promise<Item[]> {
  if (spaceIds.length === 0) return []

  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('items')
    .select('*')
    .in('space_id', spaceIds)
    .eq('completed', false)
    .ilike('title', `%${query}%`)
    .order('title')
    .limit(20)

  if (error) throw error
  return data.map(rowToItem)
}

export async function reorderItems(
  _spaceId: string,
  orderedIds: string[],
): Promise<void> {
  const supabase = getSupabaseClient()
  const results = await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from('items').update({ sort_order: index }).eq('id', id),
    ),
  )
  const failed = results.find((r) => r.error)
  if (failed?.error) throw failed.error
}

// Advance a recurring item to its next occurrence without marking it complete.
export async function advanceRecurringItem(
  id: string,
  nextStartDate: Date,
  nextEndDate?: Date,
  googleEventId?: string | null,
): Promise<Item> {
  const supabase = getSupabaseClient()
  const dbInput: Record<string, unknown> = {
    start_date: nextStartDate.toISOString(),
    end_date: nextEndDate?.toISOString() ?? null,
    updated_at: new Date().toISOString(),
  }
  if (googleEventId !== undefined) dbInput['google_event_id'] = googleEventId

  const { data, error } = await supabase
    .from('items')
    .update(dbInput)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return rowToItem(data)
}

// Query 1: non-recurring items strictly within the calendar window.
// Uses full ISO timestamps (not date-only strings) so items stored at
// non-midnight UTC (e.g. created at 10pm PST = next day UTC) are included.
export async function fetchNonRecurringCalendarItems(
  familyId: string,
  windowStart: Date,
  windowEnd: Date,
): Promise<Item[]> {
  const supabase = getSupabaseClient()
  const start = new Date(windowStart)
  start.setHours(0, 0, 0, 0)
  const end = new Date(windowEnd)
  end.setHours(23, 59, 59, 999)

  const { data, error } = await supabase
    .from('items')
    .select('*')
    .eq('family_id', familyId)
    .is('recurrence', null)
    .gte('start_date', start.toISOString())
    .lte('start_date', end.toISOString())
    .eq('completed', false)

  if (error) throw error
  return data.map(rowToItem)
}

// Upcoming widget — primary: non-recurring items in [startISO, endISO], max 5.
// Recurring items are excluded — the widget works on anchored start_dates only.
// Callers are responsible for computing startISO/endISO boundaries.
export async function fetchUpcomingItems(
  familyId: string,
  startISO: string,
  endISO: string,
): Promise<Item[]> {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase
    .from('items')
    .select('*')
    .eq('family_id', familyId)
    .eq('completed', false)
    .is('recurrence', null)
    .gte('start_date', startISO)
    .lte('start_date', endISO)
    .order('start_date', { ascending: true })
    .limit(5)

  if (error) throw error
  return data.map(rowToItem)
}

// Upcoming widget — fallback: next single non-recurring item after afterISO.
// Only called when the primary window returns empty.
export async function fetchNextItemAfter(
  familyId: string,
  afterISO: string,
): Promise<Item[]> {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase
    .from('items')
    .select('*')
    .eq('family_id', familyId)
    .eq('completed', false)
    .is('recurrence', null)
    .gt('start_date', afterISO)
    .order('start_date', { ascending: true })
    .limit(1)

  if (error) throw error
  return data.map(rowToItem)
}

// Query 2: all active recurring items whose current start_date falls at or before
// the window end. No lower bound — expandRecurringItem projects occurrences
// client-side. Historical navigation shows nothing for items already advanced
// past the window (their past occurrences were completed and filtered out).
export async function fetchRecurringCalendarItems(
  familyId: string,
  windowEnd: Date,
): Promise<Item[]> {
  const supabase = getSupabaseClient()
  const end = new Date(windowEnd)
  end.setHours(23, 59, 59, 999)

  const { data, error } = await supabase
    .from('items')
    .select('*')
    .eq('family_id', familyId)
    .not('recurrence', 'is', null)
    .lte('start_date', end.toISOString())
    .eq('completed', false)

  if (error) throw error
  return data.map(rowToItem)
}

// Uncomplete an existing item rather than creating a new row.
export async function reAddItem(original: Item): Promise<Item> {
  const supabase = getSupabaseClient()
  const now = new Date().toISOString()
  const { data, error } = await supabase
    .from('items')
    .update({ completed: false, completed_at: null, updated_at: now })
    .eq('id', original.id)
    .select()
    .single()

  if (error) throw error
  return rowToItem(data)
}
