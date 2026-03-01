import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  createSpace,
  updateSpace,
  deleteSpace,
  reorderSpaces,
} from '#/lib/supabase/spaces'
import type { SpaceType } from '#/entities/Space'

export function useSpaceMutations(familyId: string) {
  const queryClient = useQueryClient()
  const key = ['spaces', familyId]

  const invalidate = () => queryClient.invalidateQueries({ queryKey: key })

  const create = useMutation({
    mutationFn: (input: {
      name: string
      color: string
      type: SpaceType
    }) => createSpace({ familyId, ...input }),
    onSuccess: () => {
      void invalidate()
      toast.success('Space created')
    },
    onError: () => {
      toast.error('Failed to create space')
    },
  })

  const update = useMutation({
    mutationFn: ({
      id,
      ...input
    }: {
      id: string
      name?: string
      color?: string
      type?: SpaceType
    }) => updateSpace(id, input),
    onSuccess: () => {
      void invalidate()
      toast.success('Space updated')
    },
    onError: () => {
      toast.error('Failed to update space')
    },
  })

  const remove = useMutation({
    mutationFn: (id: string) => deleteSpace(id),
    onSuccess: () => {
      void invalidate()
      toast.success('Space deleted')
    },
    onError: () => {
      toast.error('Failed to delete space')
    },
  })

  const reorder = useMutation({
    mutationFn: (orderedIds: string[]) => reorderSpaces(orderedIds),
    onSuccess: () => {
      void invalidate()
    },
    onError: () => {
      toast.error('Failed to reorder spaces')
    },
  })

  return { create, update, remove, reorder }
}
