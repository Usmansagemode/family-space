import { isSameDay } from 'date-fns'
import { advanceDate } from './date'
import type { CalendarItem, Item } from '@family/types'

/**
 * Projects all occurrences of a recurring item within [windowStart, windowEnd].
 *
 * The occurrence whose date matches the item's actual DB start_date is marked
 * isVirtual=false (real, editable). All projected occurrences are isVirtual=true.
 *
 * Note: historical weeks show no recurring items whose past occurrences were
 * already completed — those rows have start_date advanced forward and are
 * filtered by the DB query (completed=false). This is by design.
 */
export function expandRecurringItem(
  item: Item,
  windowStart: Date,
  windowEnd: Date,
): CalendarItem[] {
  if (!item.startDate || !item.recurrence || !item.familyId) return []

  const occurrences: CalendarItem[] = []
  let current = new Date(item.startDate)

  // Fast-forward to the first occurrence on or after windowStart
  while (current < windowStart) {
    const next = advanceDate(current, item.recurrence)
    if (next.getTime() <= current.getTime()) break // infinite loop guard
    current = next
  }

  // Collect all occurrences within [windowStart, windowEnd]
  while (current <= windowEnd) {
    occurrences.push({
      ...item,
      familyId: item.familyId,
      startDate: new Date(current),
      isVirtual: !isSameDay(current, item.startDate),
    })

    const next = advanceDate(current, item.recurrence)
    if (next.getTime() <= current.getTime()) break
    current = next
  }

  return occurrences
}
