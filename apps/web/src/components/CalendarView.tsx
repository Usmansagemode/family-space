import { useEffect, useState } from 'react'
import { AppCalendarLazy } from '#/components/calendar/AppCalendarLazy'

const STORAGE_KEY = 'calendar-view'

type View = 'app' | 'google'

function readStoredView(): View {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (v === 'app' || v === 'google') return v
  } catch {
    // localStorage disabled / SSR — fall through to default
  }
  return 'app'
}

type Props = {
  familyId: string
  embedUrl?: string
}

export function CalendarView({ familyId, embedUrl }: Props) {
  // Start with 'app' on the server; hydrate from localStorage once mounted on the client.
  // This avoids a hydration mismatch and a ReferenceError in SSR environments.
  const [view, setView] = useState<View>('app')

  useEffect(() => {
    setView(readStoredView())
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, view)
    } catch {
      // ignore quota / disabled
    }
  }, [view])

  return (
    <div className="flex h-full flex-col">
      {/* Toggle — only shown when a Google Calendar embed URL is configured */}
      {embedUrl && (
        <div className="flex shrink-0 items-center justify-end border-b border-border/40 px-4 py-2">
          <div
            role="group"
            aria-label="Calendar view"
            className="flex rounded-lg border border-border bg-muted p-0.5 text-sm"
          >
            {(
              [
                { id: 'app', label: 'App Calendar' },
                { id: 'google', label: 'Google Calendar' },
              ] as const
            ).map(({ id, label }) => (
              <button
                key={id}
                type="button"
                aria-pressed={view === id}
                onClick={() => setView(id)}
                className={
                  view === id
                    ? 'rounded-md bg-background px-3 py-1 font-medium shadow-sm'
                    : 'px-3 py-1 text-muted-foreground hover:text-foreground'
                }
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="min-h-0 flex-1 overflow-auto">
        {view === 'google' && embedUrl ? (
          <iframe
            src={embedUrl}
            className="h-full w-full border-0"
            title="Google Calendar"
            referrerPolicy="no-referrer-when-downgrade"
            loading="lazy"
          />
        ) : (
          <AppCalendarLazy familyId={familyId} />
        )}
      </div>
    </div>
  )
}
