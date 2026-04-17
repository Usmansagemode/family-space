import { addDays, format, startOfDay, endOfDay } from 'date-fns'
import { useQuery } from '@tanstack/react-query'
import { fetchUpcomingItems, fetchNextItemAfter } from '@family/supabase'
import type { Item } from '@family/types'

export type UpcomingResult =
  | { kind: 'window'; items: Item[] }
  | { kind: 'next'; item: Item | null }

// Single query — collapses the two-fetch chain so there's one cache entry,
// one loading flag, and no mid-transition empty-state flicker.
// todayKey in queryKey naturally invalidates when the calendar date rolls over.
export function useUpcomingItems(familyId: string) {
  const todayKey = format(new Date(), 'yyyy-MM-dd')

  const query = useQuery({
    queryKey: ['upcoming-items', familyId, todayKey],
    queryFn: async (): Promise<UpcomingResult> => {
      const windowStart = startOfDay(new Date())
      const windowEnd = endOfDay(addDays(windowStart, 7))

      // Recurring items are excluded: the widget works on anchored start_dates
      // only. Recurring occurrences are projected by the calendar, not the widget.
      const primary = await fetchUpcomingItems(
        familyId,
        windowStart.toISOString(),
        windowEnd.toISOString(),
      )
      if (primary.length > 0) return { kind: 'window', items: primary }

      const fallback = await fetchNextItemAfter(
        familyId,
        windowEnd.toISOString(),
      )
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
