import { isDemoMode, supabase } from '#/lib/supabase'
import { DEMO_FAMILY_ID, SPACE_COLORS } from '#/lib/config'
import type { Space, SpaceType } from '#/entities/Space'

// --- Demo mode in-memory store ---

let demoSpaces: Space[] = [
  {
    id: 'demo-space-1',
    familyId: DEMO_FAMILY_ID,
    name: 'Costco',
    color: SPACE_COLORS[0],
    type: 'store',
    sortOrder: 0,
    createdAt: new Date('2026-01-01'),
  },
  {
    id: 'demo-space-2',
    familyId: DEMO_FAMILY_ID,
    name: 'Usman',
    color: SPACE_COLORS[1],
    type: 'person',
    sortOrder: 1,
    createdAt: new Date('2026-01-02'),
  },
  {
    id: 'demo-space-3',
    familyId: DEMO_FAMILY_ID,
    name: 'Whole Foods',
    color: SPACE_COLORS[2],
    type: 'store',
    sortOrder: 2,
    createdAt: new Date('2026-01-03'),
  },
]

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms))

// --- Type helpers ---

function rowToSpace(row: {
  id: string
  family_id: string
  name: string
  color: string
  type: string
  sort_order: number
  created_at: string
}): Space {
  return {
    id: row.id,
    familyId: row.family_id,
    name: row.name,
    color: row.color,
    type: row.type as SpaceType,
    sortOrder: row.sort_order,
    createdAt: new Date(row.created_at),
  }
}

// --- CRUD ---

export async function fetchSpaces(familyId: string): Promise<Space[]> {
  if (isDemoMode) {
    await delay()
    return [...demoSpaces].sort((a, b) => a.sortOrder - b.sortOrder)
  }

  const { data, error } = await supabase!
    .from('spaces')
    .select('*')
    .eq('family_id', familyId)
    .order('sort_order', { ascending: true })

  if (error) throw error
  return (data ?? []).map(rowToSpace)
}

export async function createSpace(input: {
  familyId: string
  name: string
  color: string
  type: SpaceType
}): Promise<Space> {
  if (isDemoMode) {
    await delay()
    const newSpace: Space = {
      id: `demo-space-${Date.now()}`,
      familyId: input.familyId,
      name: input.name,
      color: input.color,
      type: input.type,
      sortOrder: demoSpaces.length,
      createdAt: new Date(),
    }
    demoSpaces = [...demoSpaces, newSpace]
    return newSpace
  }

  const maxOrder = await fetchSpaces(input.familyId)
    .then((spaces) => spaces.length)
    .catch(() => 0)

  const { data, error } = await supabase!
    .from('spaces')
    .insert({
      family_id: input.familyId,
      name: input.name,
      color: input.color,
      type: input.type,
      sort_order: maxOrder,
    })
    .select()
    .single()

  if (error) throw error
  return rowToSpace(data)
}

export async function updateSpace(
  id: string,
  input: Partial<{ name: string; color: string; type: SpaceType }>,
): Promise<Space> {
  if (isDemoMode) {
    await delay()
    demoSpaces = demoSpaces.map((s) => (s.id === id ? { ...s, ...input } : s))
    const updated = demoSpaces.find((s) => s.id === id)
    if (!updated) throw new Error('Space not found')
    return updated
  }

  const { data, error } = await supabase!
    .from('spaces')
    .update(input)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return rowToSpace(data)
}

export async function deleteSpace(id: string): Promise<void> {
  if (isDemoMode) {
    await delay()
    demoSpaces = demoSpaces.filter((s) => s.id !== id)
    return
  }

  const { error } = await supabase!.from('spaces').delete().eq('id', id)
  if (error) throw error
}

export async function reorderSpaces(orderedIds: string[]): Promise<void> {
  if (isDemoMode) {
    await delay(100)
    demoSpaces = demoSpaces.map((s) => ({
      ...s,
      sortOrder: orderedIds.indexOf(s.id),
    }))
    return
  }

  const updates = orderedIds.map((id, index) =>
    supabase!.from('spaces').update({ sort_order: index }).eq('id', id),
  )
  await Promise.all(updates)
}
