const API = 'https://www.googleapis.com/calendar/v3'
const TZ = Intl.DateTimeFormat().resolvedOptions().timeZone

export type CalendarEventResult = {
  id: string
  htmlLink: string
}

export async function createCalendarEvent(
  token: string,
  calendarId: string,
  input: { title: string; startDate: Date; endDate?: Date },
): Promise<CalendarEventResult> {
  const end =
    input.endDate ?? new Date(input.startDate.getTime() + 30 * 60 * 1000)

  const res = await fetch(
    `${API}/calendars/${encodeURIComponent(calendarId)}/events`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        summary: input.title,
        start: { dateTime: input.startDate.toISOString(), timeZone: TZ },
        end: { dateTime: end.toISOString(), timeZone: TZ },
      }),
    },
  )

  if (!res.ok) throw new Error(`Calendar API ${res.status}`)
  const data = (await res.json()) as { id: string; htmlLink: string }
  return { id: data.id, htmlLink: data.htmlLink }
}

export async function updateCalendarEvent(
  token: string,
  calendarId: string,
  eventId: string,
  input: { title: string; startDate: Date; endDate?: Date },
): Promise<void> {
  const end =
    input.endDate ?? new Date(input.startDate.getTime() + 30 * 60 * 1000)

  const res = await fetch(
    `${API}/calendars/${encodeURIComponent(calendarId)}/events/${eventId}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        summary: input.title,
        start: { dateTime: input.startDate.toISOString(), timeZone: TZ },
        end: { dateTime: end.toISOString(), timeZone: TZ },
      }),
    },
  )

  if (!res.ok) throw new Error(`Calendar API ${res.status}`)
}

export async function deleteCalendarEvent(
  token: string,
  calendarId: string,
  eventId: string,
): Promise<void> {
  const res = await fetch(
    `${API}/calendars/${encodeURIComponent(calendarId)}/events/${eventId}`,
    {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    },
  )

  // 404 / 410 = already gone, that's fine
  if (!res.ok && res.status !== 404 && res.status !== 410) {
    throw new Error(`Calendar API ${res.status}`)
  }
}
