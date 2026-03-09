import type { Space, SpaceType } from '@family/types'
import { getSupabaseClient } from './client'

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

export async function fetchSpaces(familyId: string): Promise<Space[]> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('spaces')
    .select('*')
    .eq('family_id', familyId)
    .order('sort_order', { ascending: true })

  if (error) throw error
  return data.map(rowToSpace)
}

export async function createSpace(input: {
  familyId: string
  name: string
  color: string
  type: SpaceType
}): Promise<Space> {
  const maxOrder = await fetchSpaces(input.familyId)
    .then((spaces) => spaces.length)
    .catch(() => 0)

  const supabase = getSupabaseClient()
  const { data, error } = await supabase
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
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('spaces')
    .update(input)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return rowToSpace(data)
}

export async function deleteSpace(id: string): Promise<void> {
  const supabase = getSupabaseClient()
  const { error } = await supabase.from('spaces').delete().eq('id', id)
  if (error) throw error
}

export async function reorderSpaces(orderedIds: string[]): Promise<void> {
  const supabase = getSupabaseClient()
  const results = await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from('spaces').update({ sort_order: index }).eq('id', id),
    ),
  )
  const failed = results.find((r) => r.error)
  if (failed?.error) throw failed.error
}
