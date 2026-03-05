import { useQuery, useQueryClient } from '@tanstack/react-query'
import { searchItems } from '#/lib/supabase/items'
import type { Space } from '#/entities/Space'
import type { Item } from '#/entities/Item'

export type SearchResult = {
  item: Item
  space: Space
}

export function useSearchItems(
  familyId: string,
  query: string,
): { data: SearchResult[] | undefined; isLoading: boolean } {
  const queryClient = useQueryClient()

  return useQuery({
    queryKey: ['search', familyId, query],
    queryFn: async () => {
      const spaces =
        queryClient.getQueryData<Space[]>(['spaces', familyId]) ?? []
      const spaceIds = spaces.map((s) => s.id)
      const items = await searchItems(spaceIds, query)
      return items
        .map((item) => ({
          item,
          space: spaces.find((s) => s.id === item.spaceId)!,
        }))
        .filter((r) => r.space)
    },
    enabled: query.trim().length >= 1,
    staleTime: 0,
  })
}
