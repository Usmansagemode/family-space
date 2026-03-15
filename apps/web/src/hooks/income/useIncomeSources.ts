import { useQuery } from '@tanstack/react-query'
import { fetchIncomeSources } from '@family/supabase'

export function useIncomeSources(familyId: string) {
  return useQuery({
    queryKey: ['income-sources', familyId],
    queryFn: () => fetchIncomeSources(familyId),
    enabled: !!familyId,
    staleTime: 1000 * 60 * 5,
  })
}
