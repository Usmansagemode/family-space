import { useEffect, useMemo, useRef, useState } from 'react'
import { useCalendarApp, ScheduleXCalendar } from '@schedule-x/react'
import { createViewWeek, createViewMonthGrid } from '@schedule-x/calendar'
import type { CalendarEventExternal } from '@schedule-x/calendar'
import { Temporal as TemporalPolyfill } from 'temporal-polyfill'
import { format } from 'date-fns'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  completeItem,
  updateItem,
  deleteItem as deleteItemFn,
  advanceRecurringItem,
  fetchNonRecurringCalendarItems,
  fetchRecurringCalendarItems,
} from '@family/supabase'
import { advanceDate, hasExplicitTime } from '@family/utils'
import {
  useCalendarItems,
  useSpaces,
  calendarItemsQueryKeys,
} from '@family/hooks'
import type { CalendarItem, Item, Recurrence } from '@family/types'
import { useIsDark } from '#/hooks/useIsDark'
import { AddItemSheet } from '#/components/board/AddItemSheet'
import { QuickCreateItemDialog } from '#/components/calendar/QuickCreateItemDialog'
import '@schedule-x/theme-default/dist/index.css'
import './calendar.css'

// schedule-x references Temporal as a bare global (no import). Polyfill globalThis
// if native Temporal is unavailable so schedule-x's instanceof checks find the same
// class we use when creating PlainDate/ZonedDateTime event dates.
const g = globalThis as Record<string, unknown>
if (!g['Temporal']) g['Temporal'] = TemporalPolyfill
const Temporal = (g['Temporal'] ?? TemporalPolyfill) as typeof TemporalPolyfill

const LOCAL_TZ = Intl.DateTimeFormat().resolvedOptions().timeZone

export interface AppCalendarProps {
  familyId: string
}

// Narrow shape of schedule-x's Temporal objects (global Temporal API, not in TS stdlib yet).
// Guards against schedule-x emitting a plain string ('YYYY-MM-DD') in some versions.
type TemporalLike = { year: number; month: number; day: number }

function toTemporalDate(v: unknown): TemporalLike | null {
  if (typeof v === 'string') {
    const [y, m, d] = v.split('-').map(Number)
    if (y && m >= 1 && m <= 12 && d >= 1 && d <= 31) return { year: y, month: m, day: d }
    return null
  }
  if (v && typeof v === 'object' && 'year' in v && 'month' in v && 'day' in v) {
    const t = v as Record<string, unknown>
    if (
      typeof t.year === 'number' &&
      typeof t.month === 'number' && t.month >= 1 && t.month <= 12 &&
      typeof t.day === 'number' && t.day >= 1 && t.day <= 31
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
  const isDark = useIsDark()

  // Bridges stable schedule-x callbacks with the latest React-rendered item data
  const itemMapRef = useRef(new Map<string, CalendarItem>())

  const { events: scheduleEvents, itemMap } = useMemo(() => {
    const map = new Map<string, CalendarItem>()
    const events: CalendarEventExternal[] = []

    for (const item of calendarItems) {
      if (!item.startDate) continue
      const s = item.startDate
      const dateStr = format(s, 'yyyy-MM-dd')
      const eventId = item.isVirtual ? `v-${item.id}-${dateStr}` : `r-${item.id}`

      let startVal: unknown
      let endVal: unknown

      if (hasExplicitTime(s)) {
        // Timed item — place at the correct time slot using ZonedDateTime.
        // End = explicit endDate if timed, otherwise +1 hour from start.
        const e =
          item.endDate && hasExplicitTime(item.endDate)
            ? item.endDate
            : new Date(s.getTime() + 60 * 60 * 1000)
        startVal = Temporal.ZonedDateTime.from({
          year: s.getFullYear(),
          month: s.getMonth() + 1,
          day: s.getDate(),
          hour: s.getHours(),
          minute: s.getMinutes(),
          second: 0,
          timeZone: LOCAL_TZ,
        })
        endVal = Temporal.ZonedDateTime.from({
          year: e.getFullYear(),
          month: e.getMonth() + 1,
          day: e.getDate(),
          hour: e.getHours(),
          minute: e.getMinutes(),
          second: 0,
          timeZone: LOCAL_TZ,
        })
      } else {
        // Date-only item — show in the all-day row.
        const plainDate = Temporal.PlainDate.from(dateStr)
        startVal = plainDate
        endVal = plainDate
      }

      map.set(eventId, item)
      events.push({
        id: eventId,
        title: item.title,
        start: startVal as CalendarEventExternal['start'],
        end: endVal as CalendarEventExternal['end'],
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
    void queryClient.invalidateQueries({ queryKey: ['calendar-items', 'non-recurring', familyId] })
    void queryClient.invalidateQueries({ queryKey: ['calendar-items', 'recurring', familyId] })
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
    isDark,
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

  // Sync app dark mode to schedule-x so its .is-dark class applies correctly
  useEffect(() => {
    if (!calendar) return
    calendar.setTheme(isDark ? 'dark' : 'light')
  }, [calendar, isDark])

  // Prefetch the adjacent 7-day windows so navigation shows no loading spinner
  useEffect(() => {
    const STALE = 1000 * 60 * 2

    const prefetch = (start: Date, end: Date) => {
      const keys = calendarItemsQueryKeys(familyId, start, end)
      void queryClient.prefetchQuery({
        queryKey: keys.nonRecurring,
        queryFn: () => fetchNonRecurringCalendarItems(familyId, start, end),
        staleTime: STALE,
      })
      void queryClient.prefetchQuery({
        queryKey: keys.recurring,
        queryFn: () => fetchRecurringCalendarItems(familyId, end),
        staleTime: STALE,
      })
    }

    const prevEnd = new Date(windowStart.getTime() - 1)
    const prevStart = new Date(prevEnd)
    prevStart.setDate(prevStart.getDate() - 6)
    prevStart.setHours(0, 0, 0, 0)

    const nextStart = new Date(windowEnd.getTime() + 1)
    const nextEnd = new Date(nextStart)
    nextEnd.setDate(nextEnd.getDate() + 6)
    nextEnd.setHours(23, 59, 59, 999)

    prefetch(prevStart, prevEnd)
    prefetch(nextStart, nextEnd)
  }, [windowStart, windowEnd, familyId, queryClient])

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
