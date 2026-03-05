import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  createItem,
  updateItem,
  completeItem,
  deleteItem,
  reAddItem,
  moveItem,
} from '#/lib/supabase/items'
import {
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
} from '#/lib/google-calendar'
import { useBoardContext } from '#/contexts/board'
import type { Item } from '#/entities/Item'

export function useItemMutations(spaceId: string) {
  const queryClient = useQueryClient()
  const { providerToken, calendarId } = useBoardContext()
  const key = ['items', spaceId]

  const invalidate = () => queryClient.invalidateQueries({ queryKey: key })

  // Helper: delete a Google Calendar event if we have the credentials + eventId
  async function tryDeleteEvent(googleEventId: string | undefined) {
    if (googleEventId && providerToken && calendarId) {
      await deleteCalendarEvent(providerToken, calendarId, googleEventId)
    }
  }

  const create = useMutation({
    mutationFn: async (input: {
      title: string
      description?: string
      quantity?: string
      startDate?: Date
      endDate?: Date
    }) => {
      let googleEventId: string | undefined

      if (providerToken && calendarId && input.startDate) {
        const result = await createCalendarEvent(providerToken, calendarId, {
          title: input.title,
          startDate: input.startDate,
          endDate: input.endDate,
        })
        googleEventId = result.id
      }

      return createItem({ spaceId, ...input, googleEventId })
    },
    onSuccess: () => {
      void invalidate()
      toast.success('Item added')
    },
    onError: () => {
      toast.error('Failed to add item')
    },
  })

  const update = useMutation({
    mutationFn: async (input: {
      id: string
      title?: string
      description?: string
      quantity?: string | null
      startDate?: Date
      endDate?: Date
    }) => {
      let googleEventId: string | null | undefined = undefined

      if (providerToken && calendarId) {
        const cached = queryClient
          .getQueryData<Item[]>(key)
          ?.find((i) => i.id === input.id)
        const existingEventId = cached?.googleEventId

        if (existingEventId) {
          if (input.startDate !== undefined) {
            // Date still set — update the event (title or date may have changed)
            await updateCalendarEvent(
              providerToken,
              calendarId,
              existingEventId,
              {
                title: input.title ?? cached?.title ?? '',
                startDate: input.startDate,
                endDate: input.endDate,
              },
            )
          } else {
            // Date was cleared — delete the event
            await deleteCalendarEvent(
              providerToken,
              calendarId,
              existingEventId,
            )
            googleEventId = null
          }
        } else if (input.startDate !== undefined) {
          // Date newly added — create event
          const result = await createCalendarEvent(providerToken, calendarId, {
            title: input.title ?? cached?.title ?? '',
            startDate: input.startDate,
            endDate: input.endDate,
          })
          googleEventId = result.id
        }
      }

      return updateItem(input.id, {
        title: input.title,
        description: input.description,
        quantity: input.quantity,
        startDate: input.startDate,
        endDate: input.endDate,
        ...(googleEventId !== undefined && { googleEventId }),
      })
    },
    onSuccess: () => {
      void invalidate()
      toast.success('Item updated')
    },
    onError: () => {
      toast.error('Failed to update item')
    },
  })

  const complete = useMutation({
    mutationFn: async (item: Item) => {
      await tryDeleteEvent(item.googleEventId)
      return completeItem(item.id)
    },
    onMutate: async (item) => {
      await queryClient.cancelQueries({ queryKey: key })
      const prev = queryClient.getQueryData<Item[]>(key)
      queryClient.setQueryData<Item[]>(key, (old) =>
        old?.map((i) =>
          i.id === item.id
            ? { ...i, completed: true, completedAt: new Date() }
            : i,
        ),
      )
      return { prev }
    },
    onSuccess: () => {
      toast.success('Marked as done')
    },
    onError: (_err, _item, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(key, ctx.prev)
      toast.error('Failed to complete item')
    },
    onSettled: () => {
      void invalidate()
    },
  })

  const remove = useMutation({
    mutationFn: async (item: Item) => {
      await tryDeleteEvent(item.googleEventId)
      return deleteItem(item.id)
    },
    onMutate: async (item) => {
      await queryClient.cancelQueries({ queryKey: key })
      const prev = queryClient.getQueryData<Item[]>(key)
      queryClient.setQueryData<Item[]>(key, (old) =>
        old?.filter((i) => i.id !== item.id),
      )
      return { prev }
    },
    onError: (_err, _item, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(key, ctx.prev)
      toast.error('Failed to delete item')
    },
    onSettled: () => {
      void invalidate()
    },
  })

  const reAdd = useMutation({
    mutationFn: (original: Item) => reAddItem(original),
    onMutate: async (original) => {
      await queryClient.cancelQueries({ queryKey: key })
      const prev = queryClient.getQueryData<Item[]>(key)
      // Optimistically mark the item as active again
      queryClient.setQueryData<Item[]>(key, (old) =>
        old?.map((i) =>
          i.id === original.id
            ? { ...i, completed: false, completedAt: undefined }
            : i,
        ),
      )
      return { prev }
    },
    onSuccess: () => {
      toast.success('Item re-added')
    },
    onError: (_err, _item, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(key, ctx.prev)
      toast.error('Failed to re-add item')
    },
    onSettled: () => {
      void invalidate()
    },
  })

  const move = useMutation({
    mutationFn: ({ id, newSpaceId }: { id: string; newSpaceId: string }) =>
      moveItem(id, newSpaceId),
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: key })
      const prev = queryClient.getQueryData<Item[]>(key)
      queryClient.setQueryData<Item[]>(key, (old) =>
        old?.filter((i) => i.id !== id) ?? [],
      )
      return { prev }
    },
    onSuccess: (_data, { newSpaceId }) => {
      void queryClient.invalidateQueries({ queryKey: ['items', newSpaceId] })
      toast.success('Item moved')
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(key, ctx.prev)
      toast.error('Failed to move item')
    },
    onSettled: () => void invalidate(),
  })

  return { create, update, complete, remove, reAdd, move }
}
