import { CalendarDays } from 'lucide-react'

type Props = {
  embedUrl?: string
}

export function CalendarView({ embedUrl }: Props) {
  if (!embedUrl) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
        <CalendarDays className="h-10 w-10 text-muted-foreground/40" />
        <div>
          <p className="text-sm font-medium">No calendar linked yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Add a Calendar Embed URL in Settings to view your calendar here.
          </p>
        </div>
      </div>
    )
  }

  return (
    <iframe
      src={embedUrl}
      className="h-full w-full border-0"
      title="Google Calendar"
    />
  )
}
