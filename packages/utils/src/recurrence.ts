import { isSameDay } from 'date-fns'
import pkg from 'rrule'
const { RRule } = pkg
import type { CalendarItem, Item } from '@family/types'

// rrule is timezone-naive and treats all dates as UTC. Normalize to UTC
// midnight so that local dates (new Date(y,m,d)) don't shift when interpreted
// as UTC in non-UTC timezones.
function toUTCMidnight(date: Date): Date {
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
}

function fromUTCMidnight(date: Date): Date {
  return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
}

/**
 * Projects all occurrences of a recurring item within [windowStart, windowEnd].
 *
 * The occurrence whose date matches the item's actual DB start_date is marked
 * isVirtual=false (real, editable). All projected occurrences are isVirtual=true.
 *
 * Note: follows RFC 5545 for month-end rollover — e.g. FREQ=MONTHLY starting
 * Jan 31 skips February (no day 31) and lands on Mar 31. This matches Google
 * Calendar behavior.
 */
export function expandRecurringItem(
  item: Item,
  windowStart: Date,
  windowEnd: Date,
): CalendarItem[] {
  if (!item.startDate || !item.recurrence || !item.familyId) return []

  const rule = new RRule({
    ...RRule.parseString(item.recurrence),
    dtstart: toUTCMidnight(item.startDate),
  })

  return rule
    .between(toUTCMidnight(windowStart), toUTCMidnight(windowEnd), true)
    .map((utcDate) => {
      const localDate = fromUTCMidnight(utcDate)
      return {
        ...item,
        familyId: item.familyId as string,
        startDate: localDate,
        isVirtual: !isSameDay(localDate, item.startDate as Date),
      }
    })
}
