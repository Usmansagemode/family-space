import { useQuery } from '@tanstack/react-query'
import { fetchFamily } from '#/lib/supabase/families'

export function useFamily(familyId: string) {
  return useQuery({
    queryKey: ['family', familyId],
    queryFn: () => fetchFamily(familyId),
    staleTime: Infinity,
  })
}
