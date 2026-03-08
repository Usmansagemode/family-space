import { supabase } from '#/lib/supabase'

export type RawActivityItem = {
  id: string
  title: string
  createdAt: Date
  completedAt: Date | null
  createdBy: string | null
  spaceName: string
  spaceColor: string
}

export async function fetchRecentActivity(
  spaceIds: string[],
): Promise<RawActivityItem[]> {
  if (spaceIds.length === 0) return []

  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - 14)

  const { data, error } = await supabase
    .from('items')
    .select(
      'id, title, created_at, completed_at, created_by, spaces!inner(name, color)',
    )
    .in('space_id', spaceIds)
    .or(
      `created_at.gte.${cutoff.toISOString()},completed_at.gte.${cutoff.toISOString()}`,
    )
    .order('created_at', { ascending: false })
    .limit(60)

  if (error) throw error

  return data.map((row) => {
    const space = row.spaces as { name: string; color: string }
    return {
      id: row.id,
      title: row.title,
      createdAt: new Date(row.created_at),
      completedAt: row.completed_at ? new Date(row.completed_at) : null,
      createdBy: row.created_by as string | null,
      spaceName: space.name,
      spaceColor: space.color,
    }
  })
}
