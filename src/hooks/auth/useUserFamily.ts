import { useQuery } from '@tanstack/react-query'
import { findOrCreateFamily  } from '#/lib/supabase/families'
import type {Family} from '#/lib/supabase/families';

export function useUserFamily(userId: string | undefined) {
  return useQuery<Family>({
    queryKey: ['family', 'user', userId],
    queryFn: () => findOrCreateFamily(userId!),
    enabled: !!userId,
    staleTime: Infinity,
  })
}
