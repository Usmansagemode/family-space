import { useQuery } from '@tanstack/react-query'
import { fetchActivityLog } from '@family/supabase'
import { useFamilyMembers } from '../auth/useFamilyMembers'
import type { ActivityEvent } from '@family/types'

export type { ActivityEvent }

export function useActivityFeed(
  familyId: string | undefined,
  enabled: boolean,
) {
  const { data: members } = useFamilyMembers(familyId)

  return useQuery<ActivityEvent[]>({
    queryKey: ['activity', familyId],
    queryFn: async () => {
      const rows = await fetchActivityLog(familyId!)

      return rows.map((row) => {
        const member = (members ?? []).find((m) => m.userId === row.actorId)
        const actorName = member?.name ?? member?.email ?? null

        return {
          id: row.id,
          eventType: row.eventType,
          payload: row.payload,
          actorId: row.actorId,
          actorName,
          timestamp: row.createdAt,
        }
      })
    },
    enabled: enabled && !!familyId,
    staleTime: 30_000,
  })
}
