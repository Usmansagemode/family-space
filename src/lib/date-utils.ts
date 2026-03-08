import { addDays, addWeeks, addMonths, addYears } from 'date-fns'
import type { Recurrence } from '#/entities/Item'

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
