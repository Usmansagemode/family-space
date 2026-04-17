import { format } from 'date-fns'
import { useQuery } from '@tanstack/react-query'
import { fetchUpcomingItems, fetchNextItemAfter } from '@family/supabase'
import type { Item } from '@family/types'

export type UpcomingResult =
  | { kind: 'window'; items: Item[] }
  | { kind: 'next'; item: Item | null }

// Single source of truth for the cache key — callers that need to do
// setQueryData/cancelQueries should import this instead of reconstructing it.
export function upcomingItemsQueryKey(familyId: string) {
  return ['upcoming-items', familyId, format(new Date(), 'yyyy-MM-dd')] as const
}

// Single query — collapses the two-fetch chain so there's one cache entry,
// one loading flag, and no mid-transition empty-state flicker.
// todayKey in queryKey naturally invalidates when the calendar date rolls over.
export function useUpcomingItems(familyId: string) {
  const todayKey = format(new Date(), 'yyyy-MM-dd')

  const query = useQuery({
    queryKey: ['upcoming-items', familyId, todayKey],
    queryFn: async (): Promise<UpcomingResult> => {
      const now = new Date()
      // Use YYYY-MM-DD strings to match how start_date is stored (UTC midnight).
      const todayStr = format(now, 'yyyy-MM-dd')
      const in7Str = format(
        new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7),
        'yyyy-MM-dd',
      )

      // Recurring items are excluded: the widget works on anchored start_dates
      // only. Recurring occurrences are projected by the calendar, not the widget.
      const primary = await fetchUpcomingItems(familyId, todayStr, in7Str)
      if (primary.length > 0) return { kind: 'window', items: primary }

      const fallback = await fetchNextItemAfter(familyId, in7Str)
      return { kind: 'next', item: fallback[0] ?? null }
    },
    enabled: !!familyId,
    staleTime: 2 * 60 * 1000,
  })

  return {
    data: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error,
  }
}
