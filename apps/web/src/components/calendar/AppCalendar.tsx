import { useEffect, useMemo, useRef, useState } from 'react'
import { useCalendarApp, ScheduleXCalendar } from '@schedule-x/react'
import { createViewWeek, createViewMonthGrid } from '@schedule-x/calendar'
import type { CalendarEventExternal } from '@schedule-x/calendar'
import '@schedule-x/theme-default/dist/index.css'
import './calendar.css'
import { format } from 'date-fns'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  completeItem,
  updateItem,
  deleteItem as deleteItemFn,
  advanceRecurringItem,
} from '@family/supabase'
import { advanceDate } from '@family/utils'
import { useCalendarItems, useSpaces } from '@family/hooks'
import type { CalendarItem, Item, Recurrence } from '@family/types'
import { AddItemSheet } from '#/components/board/AddItemSheet'
import { QuickCreateItemDialog } from '#/components/calendar/QuickCreateItemDialog'

export interface AppCalendarProps {
  familyId: string
}

// Narrow shape of schedule-x's Temporal objects (global Temporal API, not in TS stdlib yet).
// Guards against schedule-x emitting a plain string ('YYYY-MM-DD') in some versions.
type TemporalLike = { year: number; month: number; day: number }

function toTemporalDate(v: unknown): TemporalLike | null {
  if (typeof v === 'string') {
    const [y, m, d] = v.split('-').map(Number)
    if (y && m && d) return { year: y, month: m, day: d }
    return null
  }
  if (v && typeof v === 'object' && 'year' in v && 'month' in v && 'day' in v) {
    const t = v as Record<string, unknown>
    if (
      typeof t.year === 'number' &&
      typeof t.month === 'number' &&
      typeof t.day === 'number'
    ) {
      return { year: t.year, month: t.month, day: t.day }
    }
  }
  return null
}

export function AppCalendar({ familyId }: AppCalendarProps) {
  // Calendar window — updated by onRangeUpdate; initial covers ±2 weeks
  const [windowStart, setWindowStart] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() - 7)
    d.setHours(0, 0, 0, 0)
    return d
  })
  const [windowEnd, setWindowEnd] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() + 14)
    d.setHours(23, 59, 59, 999)
    return d
  })

  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [createDate, setCreateDate] = useState<Date | undefined>()

  const { data: calendarItems = [] } = useCalendarItems(familyId, windowStart, windowEnd)
  const { data: spaces = [] } = useSpaces(familyId)
  const queryClient = useQueryClient()

  // Bridges stable schedule-x callbacks with the latest React-rendered item data
  const itemMapRef = useRef(new Map<string, CalendarItem>())

  const { events: scheduleEvents, itemMap } = useMemo(() => {
    const map = new Map<string, CalendarItem>()
    const events: CalendarEventExternal[] = []

    for (const item of calendarItems) {
      if (!item.startDate) continue
      const dateStr = format(item.startDate, 'yyyy-MM-dd')
      const eventId = item.isVirtual ? `v-${item.id}-${dateStr}` : `r-${item.id}`
      map.set(eventId, item)
      events.push({
        id: eventId,
        title: item.title,
        start: dateStr,
        end: dateStr,
        cssClass: item.isVirtual ? 'sx-event-virtual' : undefined,
      })
    }

    return { events, itemMap: map }
  }, [calendarItems])

  // Sync the item map ref outside of useMemo to avoid side effects in render
  useEffect(() => {
    itemMapRef.current = itemMap
  }, [itemMap])

  const invalidateCalendar = () => {
    void queryClient.invalidateQueries({ queryKey: ['calendar-items'] })
    void queryClient.invalidateQueries({ queryKey: ['upcoming-items', familyId] })
  }

  const completeMutation = useMutation({
    mutationFn: async (item: Item) => {
      if (item.recurrence && item.startDate) {
        const nextStart = advanceDate(item.startDate, item.recurrence)
        const nextEnd = item.endDate ? advanceDate(item.endDate, item.recurrence) : undefined
        return advanceRecurringItem(item.id, nextStart, nextEnd, null)
      }
      return completeItem(item.id)
    },
    onSuccess: (_, item) => {
      void queryClient.invalidateQueries({ queryKey: ['items', item.spaceId] })
      invalidateCalendar()
      if (item.recurrence && item.startDate) {
        const next = advanceDate(item.startDate, item.recurrence)
        toast.success(`Rescheduled to ${format(next, 'MMM d')}`)
      } else {
        toast.success('Marked as done')
      }
      setSelectedEventId(null)
    },
    onError: () => toast.error('Failed to complete item'),
  })

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      ...rest
    }: {
      id: string
      title?: string
      description?: string
      quantity?: string | null
      startDate?: Date
      endDate?: Date
      recurrence?: Recurrence | null
    }) => updateItem(id, rest),
    onSuccess: () => {
      invalidateCalendar()
      toast.success('Item updated')
      setSelectedEventId(null)
    },
    onError: () => toast.error('Failed to update item'),
  })

  const removeMutation = useMutation({
    mutationFn: (item: Item) => deleteItemFn(item.id),
    onSuccess: (_, item) => {
      void queryClient.invalidateQueries({ queryKey: ['items', item.spaceId] })
      invalidateCalendar()
      toast.success('Item deleted')
      setSelectedEventId(null)
    },
    onError: () => toast.error('Failed to delete item'),
  })

  // Stable state setters in callbacks avoid stale closures without refs
  const calendar = useCalendarApp({
    views: [createViewWeek(), createViewMonthGrid()],
    defaultView: 'week',
    events: [],
    callbacks: {
      onEventClick: (event: CalendarEventExternal) => {
        setSelectedEventId(String(event.id))
      },
      onClickDate: (date: unknown) => {
        const d = toTemporalDate(date)
        if (!d) return
        setCreateDate(new Date(d.year, d.month - 1, d.day, 12, 0, 0))
        setCreateOpen(true)
      },
      onRangeUpdate: (range: unknown) => {
        const r = range as { start: unknown; end: unknown }
        const start = toTemporalDate(r?.start)
        const end = toTemporalDate(r?.end)
        if (start) setWindowStart(new Date(start.year, start.month - 1, start.day, 0, 0, 0, 0))
        if (end) setWindowEnd(new Date(end.year, end.month - 1, end.day, 23, 59, 59, 999))
      },
    },
  })

  useEffect(() => {
    if (!calendar) return
    calendar.events.set(scheduleEvents)
  }, [calendar, scheduleEvents])

  const selectedItem = selectedEventId
    ? (itemMapRef.current.get(selectedEventId) ?? null)
    : null
  const selectedSpace = selectedItem
    ? spaces.find((s) => s.id === selectedItem.spaceId)
    : null
  const isVirtual = selectedItem?.isVirtual ?? false
  const isPending =
    completeMutation.isPending || updateMutation.isPending || removeMutation.isPending

  return (
    <>
      <ScheduleXCalendar calendarApp={calendar} />

      {selectedItem && selectedSpace && (
        <AddItemSheet
          open
          onOpenChange={(open) => !open && setSelectedEventId(null)}
          spaceId={selectedItem.spaceId}
          spaceName={selectedSpace.name}
          spaceType={selectedSpace.type}
          spaceColor={selectedSpace.color}
          familyId={familyId}
          editItem={selectedItem}
          note={isVirtual ? 'Editing this will update all future occurrences.' : undefined}
          onCreate={() => {}}
          onUpdate={(input) => updateMutation.mutate(input)}
          onComplete={(item) => completeMutation.mutate(item)}
          onDelete={(item) => removeMutation.mutate(item)}
          isPending={isPending}
        />
      )}

      <QuickCreateItemDialog
        open={createOpen}
        onOpenChange={(open) => {
          setCreateOpen(open)
          if (!open) setCreateDate(undefined)
        }}
        familyId={familyId}
        initialDate={createDate}
      />
    </>
  )
}
