import { useQuery } from '@tanstack/react-query'
import { fetchRecentActivity } from '@family/supabase'
import { useSpaces } from '../spaces/useSpaces'
import { useFamilyMembers } from '../auth/useFamilyMembers'
import type { ActivityEvent } from '@family/types'

export type { ActivityEvent }

export function useActivityFeed(
  familyId: string | undefined,
  enabled: boolean,
) {
  const { data: spaces } = useSpaces(familyId ?? '')
  const { data: members } = useFamilyMembers(familyId)
  const spaceIds = (spaces ?? []).map((s) => s.id)

  return useQuery<ActivityEvent[]>({
    queryKey: ['activity', familyId],
    queryFn: async () => {
      const cutoff = new Date()
      cutoff.setDate(cutoff.getDate() - 14)

      const items = await fetchRecentActivity(spaceIds)
      const events: ActivityEvent[] = []

      for (const item of items) {
        const actor = (members ?? []).find((m) => m.userId === item.createdBy)
        const actorName = actor?.name ?? actor?.email ?? null

        events.push({
          key: `${item.id}-added`,
          type: 'added',
          itemTitle: item.title,
          spaceName: item.spaceName,
          spaceColor: item.spaceColor,
          actorName,
          timestamp: item.createdAt,
        })

        if (item.completedAt && item.completedAt >= cutoff) {
          events.push({
            key: `${item.id}-completed`,
            type: 'completed',
            itemTitle: item.title,
            spaceName: item.spaceName,
            spaceColor: item.spaceColor,
            actorName: null,
            timestamp: item.completedAt,
          })
        }
      }

      return events
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, 40)
    },
    enabled: enabled && !!familyId && spaceIds.length > 0,
    staleTime: 30_000,
  })
}
