import { useQuery } from '@tanstack/react-query'
import { fetchSpaces } from '#/lib/supabase/spaces'

export function useSpaces(familyId: string) {
  return useQuery({
    queryKey: ['spaces', familyId],
    queryFn: () => fetchSpaces(familyId),
    staleTime: 1000 * 60 * 5,
  })
}
