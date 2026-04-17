import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { format, isToday, isTomorrow } from 'date-fns'
import { Check } from 'lucide-react'
import { toast } from 'sonner'
import { completeItem } from '@family/supabase'
import { useUpcomingItems, upcomingItemsQueryKey } from '@family/hooks'
import type { UpcomingResult } from '@family/hooks'
import type { Item } from '@family/types'
import { SPACE_COLORS } from '@family/config'
import { useSpaces } from '#/hooks/spaces/useSpaces'
import { Button } from '#/components/ui/button'
import { Skeleton } from '#/components/ui/skeleton'

interface Props {
  familyId: string
}

function formatItemDate(date: Date): string {
  if (isToday(date)) return 'Today'
  if (isTomorrow(date)) return 'Tomorrow'
  return format(date, 'EEE, MMM d')
}

export function UpcomingWidget({ familyId }: Props) {
  const { data, isLoading } = useUpcomingItems(familyId)
  const { data: spaces = [] } = useSpaces(familyId)
  const queryClient = useQueryClient()
  const [pendingId, setPendingId] = useState<string | null>(null)

  const complete = useMutation<Item, Error, Item, { prev?: UpcomingResult }>({
    mutationFn: (item) => completeItem(item.id),
    onMutate: async (item) => {
      setPendingId(item.id)
      const key = upcomingItemsQueryKey(familyId)
      await queryClient.cancelQueries({ queryKey: key })
      const prev = queryClient.getQueryData<UpcomingResult>(key)
      queryClient.setQueryData<UpcomingResult>(key, (old) => {
        if (!old) return old
        if (old.kind === 'window') {
          return { kind: 'window', items: old.items.filter((i) => i.id !== item.id) }
        }
        if (old.kind === 'next' && old.item?.id === item.id) {
          return { kind: 'next', item: null }
        }
        return old
      })
      return { prev }
    },
    onSuccess: (_data, item) => {
      if (item.googleEventId) {
        toast.success('Marked as done — remove the event from Google Calendar manually')
      } else {
        toast.success('Marked as done')
      }
    },
    onError: (_err, _item, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(upcomingItemsQueryKey(familyId), ctx.prev)
      toast.error('Failed to complete item')
    },
    onSettled: (_data, _err, item) => {
      setPendingId(null)
      void queryClient.invalidateQueries({ queryKey: ['upcoming-items', familyId] })
      void queryClient.invalidateQueries({ queryKey: ['calendar-items'] })
      void queryClient.invalidateQueries({ queryKey: ['items', item.spaceId] })
    },
  })

  if (isLoading) {
    return (
      <div className="flex gap-3 overflow-x-auto pb-1 print:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-52 flex-shrink-0 rounded-xl" />
        ))}
      </div>
    )
  }

  let items: Item[] = []
  if (data?.kind === 'window') items = data.items
  else if (data?.kind === 'next' && data.item) items = [data.item]

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-xl border bg-card p-4 text-sm text-muted-foreground print:hidden">
        Nothing scheduled
      </div>
    )
  }

  return (
    <div className="flex gap-3 overflow-x-auto pb-1 print:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {items.map((item) => {
        const space = spaces.find((s) => s.id === item.spaceId)
        const dateLabel = item.startDate ? formatItemDate(item.startDate) : null
        const subtitle = [dateLabel, space?.name].filter(Boolean).join(' · ')

        return (
          <div
            key={item.id}
            className="bg-card flex w-52 flex-shrink-0 items-start gap-3 rounded-xl border p-3"
          >
            <div
              className="mt-0.5 h-2.5 w-2.5 flex-shrink-0 rounded-full"
              style={{ backgroundColor: space?.color ?? SPACE_COLORS[0] }}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium leading-snug">{item.title}</p>
              {subtitle && (
                <p className="text-muted-foreground mt-0.5 truncate text-xs">{subtitle}</p>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 flex-shrink-0 text-muted-foreground hover:text-green-600"
              disabled={!!item.recurrence || pendingId === item.id}
              onClick={() => complete.mutate(item)}
            >
              <Check className="h-4 w-4" />
            </Button>
          </div>
        )
      })}
    </div>
  )
}
