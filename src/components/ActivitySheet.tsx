import { formatDistanceToNow } from 'date-fns'
import { CheckCheck, Plus } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '#/components/ui/sheet'
import { Skeleton } from '#/components/ui/skeleton'
import { useActivityFeed } from '#/hooks/family/useActivityFeed'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  familyId: string | undefined
}

export function ActivitySheet({ open, onOpenChange, familyId }: Props) {
  const { data: events, isLoading } = useActivityFeed(familyId, open)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex max-w-sm flex-col gap-0 p-0">
        <SheetHeader className="border-b border-border px-6 py-4">
          <SheetTitle>Recent Activity</SheetTitle>
          <SheetDescription className="sr-only">
            Items added and completed by family members in the last 14 days
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-1 flex-col overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col gap-4 p-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Skeleton className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full" />
                  <div className="flex flex-1 flex-col gap-1.5">
                    <Skeleton className="h-3.5 w-3/4" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : !events?.length ? (
            <div className="flex flex-col items-center gap-2 px-6 py-16 text-center">
              <p className="text-sm font-medium text-muted-foreground">
                No recent activity
              </p>
              <p className="text-xs text-muted-foreground/60">
                Items added or completed by family members will appear here.
              </p>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-border/40">
              {events.map((event) => (
                <div
                  key={event.key}
                  className="flex items-start gap-3 px-6 py-3.5"
                >
                  {/* Event type icon tinted with space color */}
                  <div
                    className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                    style={{ background: event.spaceColor }}
                  >
                    {event.type === 'added' ? (
                      <Plus className="h-3 w-3 opacity-70" />
                    ) : (
                      <CheckCheck className="h-3 w-3 opacity-70" />
                    )}
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <p className="text-sm leading-snug">
                      {event.actorName && (
                        <span className="font-semibold">
                          {event.actorName}{' '}
                        </span>
                      )}
                      <span className="text-muted-foreground">
                        {event.type === 'added' ? 'added ' : 'completed '}
                      </span>
                      <span className="font-medium">{event.itemTitle}</span>
                      <span className="text-muted-foreground">
                        {' '}
                        in {event.spaceName}
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground/50">
                      {formatDistanceToNow(event.timestamp, {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
