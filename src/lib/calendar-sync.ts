import {
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
} from '#/lib/google-calendar'

// Deletes a Google Calendar event if token, calendarId, and eventId are all present
export async function tryDeleteCalendarEvent(
  token: string | null,
  calendarId: string | null,
  googleEventId: string | undefined,
): Promise<void> {
  if (!googleEventId || !calendarId || !token) return
  await deleteCalendarEvent(token, calendarId, googleEventId)
}

// Creates a calendar event and returns the new event ID, or undefined if not possible
export async function tryCreateCalendarEvent(
  token: string | null,
  calendarId: string | null,
  data: { title: string; startDate: Date; endDate?: Date },
): Promise<string | undefined> {
  if (!calendarId || !token) return undefined
  const result = await createCalendarEvent(token, calendarId, data)
  return result.id
}

// Handles calendar sync when an item is updated.
// Returns the googleEventId change to persist: null = deleted, string = new/updated, undefined = no change.
export async function syncCalendarOnUpdate(
  token: string | null,
  calendarId: string | null,
  opts: {
    existingEventId: string | undefined
    title: string
    prevTitle: string
    startDate: Date | undefined
    endDate: Date | undefined
  },
): Promise<string | null | undefined> {
  if (!calendarId || !token) return undefined

  const { existingEventId, title, prevTitle, startDate, endDate } = opts

  if (existingEventId) {
    if (startDate !== undefined) {
      // Date still set — update the event (title or date may have changed)
      await updateCalendarEvent(token, calendarId, existingEventId, {
        title,
        startDate,
        endDate,
      })
      return undefined
    } else {
      // Date was cleared — delete the event
      await deleteCalendarEvent(token, calendarId, existingEventId)
      return null
    }
  } else if (startDate !== undefined) {
    // Date newly added — create event
    const result = await createCalendarEvent(token, calendarId, {
      title: title || prevTitle,
      startDate,
      endDate,
    })
    return result.id
  }

  return undefined
}
