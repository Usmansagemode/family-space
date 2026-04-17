import { useCalendarApp, ScheduleXCalendar } from '@schedule-x/react'
import { createViewWeek, createViewMonthGrid } from '@schedule-x/calendar'
import '@schedule-x/theme-default/dist/index.css'

export interface AppCalendarProps {
  defaultView?: 'week' | 'month-grid'
}

export function AppCalendar({ defaultView = 'week' }: AppCalendarProps) {
  const calendar = useCalendarApp({
    views: [createViewWeek(), createViewMonthGrid()],
    defaultView,
    events: [],
  })

  return <ScheduleXCalendar calendarApp={calendar} />
}
