import { TrendingDown, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = {
  label: string
  value: number | string
  delta?: number | null
  deltaLabel?: string
  icon?: React.ElementType
  className?: string
}

export function StatCard({ label, value, delta, deltaLabel, icon: Icon, className }: Props) {
  const positive = delta !== undefined && delta !== null && delta >= 0
  return (
    <div
      className={cn(
        'flex flex-col gap-3 rounded-xl border border-border bg-card p-5',
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        {Icon && (
          <div className="rounded-lg bg-muted p-2">
            <Icon className="h-4 w-4 text-muted-foreground" />
          </div>
        )}
      </div>
      <div className="flex items-end justify-between gap-2">
        <span className="text-3xl font-bold tabular-nums">{value}</span>
        {delta !== undefined && delta !== null && (
          <div
            className={cn(
              'flex items-center gap-1 text-xs font-medium',
              positive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400',
            )}
          >
            {positive ? (
              <TrendingUp className="h-3.5 w-3.5" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5" />
            )}
            {deltaLabel ?? `${Math.abs(delta)}`}
          </div>
        )}
      </div>
    </div>
  )
}
