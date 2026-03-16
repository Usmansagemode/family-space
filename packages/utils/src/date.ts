import { addDays, addWeeks, addMonths, addYears } from 'date-fns'
import type { Recurrence } from '@family/types'

/** Parse a YYYY-MM-DD date string into a local Date object without UTC shift. */
export function parseLocalDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export type DateStatus = 'overdue' | 'today' | 'soon' | 'future' | null

export function getDateStatus(date: Date): DateStatus {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const dateDay = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const diffDays = Math.round(
    (dateDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  )
  if (diffDays < 0) return 'overdue'
  if (diffDays === 0) return 'today'
  if (diffDays <= 2) return 'soon'
  return 'future'
}

export function advanceDate(date: Date, recurrence: Recurrence): Date {
  switch (recurrence) {
    case 'daily':
      return addDays(date, 1)
    case 'weekly':
      return addWeeks(date, 1)
    case 'monthly':
      return addMonths(date, 1)
    case 'yearly':
      return addYears(date, 1)
  }
}
