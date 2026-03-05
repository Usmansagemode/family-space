import { isDemoMode, supabase } from '#/lib/supabase'
import type { Item } from '#/entities/Item'

// --- Demo mode in-memory store ---

let demoItems: Item[] = [
  {
    id: 'demo-item-1',
    spaceId: 'demo-space-1',
    title: 'Olive oil (2 bottles)',
    completed: false,
    createdAt: new Date('2026-01-10'),
    updatedAt: new Date('2026-01-10'),
  },
  {
    id: 'demo-item-2',
    spaceId: 'demo-space-1',
    title: 'Paper towels',
    completed: false,
    createdAt: new Date('2026-01-11'),
    updatedAt: new Date('2026-01-11'),
  },
  {
    id: 'demo-item-3',
    spaceId: 'demo-space-2',
    title: 'Dentist appointment',
    startDate: new Date('2026-03-15T10:00:00'),
    completed: false,
    createdAt: new Date('2026-01-12'),
    updatedAt: new Date('2026-01-12'),
  },
  {
    id: 'demo-item-4',
    spaceId: 'demo-space-1',
    title: 'Salmon (frozen)',
    completed: true,
    completedAt: new Date('2026-01-20'),
    createdAt: new Date('2026-01-08'),
    updatedAt: new Date('2026-01-20'),
  },
  {
    id: 'demo-item-5',
    spaceId: 'demo-space-3',
    title: 'Almond butter',
    completed: false,
    createdAt: new Date('2026-01-14'),
    updatedAt: new Date('2026-01-14'),
  },
]

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms))

// --- Type helpers ---

function rowToItem(row: {
  id: string
  space_id: string
  title: string
  description: string | null
  quantity: string | null
  start_date: string | null
  end_date: string | null
  completed: boolean
  completed_at: string | null
  google_event_id: string | null
  created_at: string
  updated_at: string
}): Item {
  return {
    id: row.id,
    spaceId: row.space_id,
    title: row.title,
    description: row.description ?? undefined,
    quantity: row.quantity ?? undefined,
    startDate: row.start_date ? new Date(row.start_date) : undefined,
    endDate: row.end_date ? new Date(row.end_date) : undefined,
    completed: row.completed,
    completedAt: row.completed_at ? new Date(row.completed_at) : undefined,
    googleEventId: row.google_event_id ?? undefined,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  }
}

// --- CRUD ---

export async function fetchItems(spaceId: string): Promise<Item[]> {
  if (isDemoMode) {
    await delay()
    return demoItems.filter((i) => i.spaceId === spaceId)
  }

  const { data, error } = await supabase!
    .from('items')
    .select('*')
    .eq('space_id', spaceId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []).map(rowToItem)
}

export async function createItem(input: {
  spaceId: string
  title: string
  description?: string
  quantity?: string
  startDate?: Date
  endDate?: Date
  googleEventId?: string
}): Promise<Item> {
  if (isDemoMode) {
    await delay()
    const now = new Date()
    const newItem: Item = {
      id: `demo-item-${Date.now()}`,
      spaceId: input.spaceId,
      title: input.title,
      description: input.description,
      quantity: input.quantity,
      startDate: input.startDate,
      endDate: input.endDate,
      googleEventId: input.googleEventId,
      completed: false,
      createdAt: now,
      updatedAt: now,
    }
    demoItems = [newItem, ...demoItems]
    return newItem
  }

  const { data, error } = await supabase!
    .from('items')
    .insert({
      space_id: input.spaceId,
      title: input.title,
      description: input.description ?? null,
      quantity: input.quantity ?? null,
      start_date: input.startDate?.toISOString() ?? null,
      end_date: input.endDate?.toISOString() ?? null,
      google_event_id: input.googleEventId ?? null,
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
    googleEventId: string | null
  }>,
): Promise<Item> {
  if (isDemoMode) {
    await delay()
    const { googleEventId: newEventId, quantity: newQty, ...fields } = input
    demoItems = demoItems.map((i) => {
      if (i.id !== id) return i
      const next: Item = { ...i, ...fields, updatedAt: new Date() }
      if (newEventId !== undefined) next.googleEventId = newEventId ?? undefined
      if (newQty !== undefined) next.quantity = newQty ?? undefined
      return next
    })
    const updated = demoItems.find((i) => i.id === id)
    if (!updated) throw new Error('Item not found')
    return updated
  }

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
  if (input.googleEventId !== undefined)
    dbInput['google_event_id'] = input.googleEventId

  const { data, error } = await supabase!
    .from('items')
    .update(dbInput)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return rowToItem(data)
}

export async function completeItem(id: string): Promise<Item> {
  if (isDemoMode) {
    await delay()
    const now = new Date()
    demoItems = demoItems.map((i) =>
      i.id === id
        ? { ...i, completed: true, completedAt: now, updatedAt: now }
        : i,
    )
    const updated = demoItems.find((i) => i.id === id)
    if (!updated) throw new Error('Item not found')
    return updated
  }

  const now = new Date().toISOString()
  const { data, error } = await supabase!
    .from('items')
    .update({ completed: true, completed_at: now, updated_at: now })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return rowToItem(data)
}

export async function deleteItem(id: string): Promise<void> {
  if (isDemoMode) {
    await delay()
    demoItems = demoItems.filter((i) => i.id !== id)
    return
  }

  const { error } = await supabase!.from('items').delete().eq('id', id)
  if (error) throw error
}

export async function moveItem(id: string, newSpaceId: string): Promise<Item> {
  if (isDemoMode) {
    await delay()
    demoItems = demoItems.map((i) =>
      i.id === id ? { ...i, spaceId: newSpaceId, updatedAt: new Date() } : i,
    )
    const updated = demoItems.find((i) => i.id === id)
    if (!updated) throw new Error('Item not found')
    return updated
  }

  const { data, error } = await supabase!
    .from('items')
    .update({ space_id: newSpaceId, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return rowToItem(data)
}

// Uncomplete an existing item rather than creating a new row.
// This keeps one row per recurring item (Apples, Paper towels, etc.)
// and prevents history from accumulating duplicates.
export async function reAddItem(original: Item): Promise<Item> {
  if (isDemoMode) {
    await delay()
    const now = new Date()
    demoItems = demoItems.map((i) =>
      i.id === original.id
        ? { ...i, completed: false, completedAt: undefined, updatedAt: now }
        : i,
    )
    const updated = demoItems.find((i) => i.id === original.id)
    if (!updated) throw new Error('Item not found')
    return updated
  }

  const now = new Date().toISOString()
  const { data, error } = await supabase!
    .from('items')
    .update({ completed: false, completed_at: null, updated_at: now })
    .eq('id', original.id)
    .select()
    .single()

  if (error) throw error
  return rowToItem(data)
}
