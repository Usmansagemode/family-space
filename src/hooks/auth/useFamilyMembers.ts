import { useQuery } from '@tanstack/react-query'
import { fetchFamilyMembers } from '#/lib/supabase/families'
import type { FamilyMember } from '#/lib/supabase/families'

export function useFamilyMembers(familyId: string | undefined) {
  return useQuery<FamilyMember[]>({
    queryKey: ['family-members', familyId],
    queryFn: () => fetchFamilyMembers(familyId!),
    enabled: !!familyId,
    staleTime: 30_000,
  })
}
