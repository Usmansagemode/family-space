import { useQuery } from '@tanstack/react-query'
import { fetchItems } from '#/lib/supabase/items'

export function useItems(spaceId: string) {
  return useQuery({
    queryKey: ['items', spaceId],
    queryFn: () => fetchItems(spaceId),
    staleTime: 1000 * 60 * 2,
  })
}
