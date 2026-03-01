import { useState } from 'react'
import { CalendarIcon } from 'lucide-react'
import { Checkbox } from '#/components/ui/checkbox'
import { cn, formatDate, formatTime, hasExplicitTime, extractHue, useIsDark } from '#/lib/utils'
import { AddItemSheet } from './AddItemSheet'
import { useItemMutations } from '#/hooks/items/useItemMutations'
import type { Item } from '#/entities/Item'

type Props = {
  item: Item
  spaceColor: string
  spaceName: string
}

export function ItemCard({ item, spaceColor, spaceName }: Props) {
  const [editOpen, setEditOpen] = useState(false)
  const { complete, update, remove } = useItemMutations(item.spaceId)
  const hue = extractHue(spaceColor)
  const isDark = useIsDark()

  // Card colors adapt properly to dark mode
  const bgColor = isDark ? `oklch(0.26 0.08 ${hue})` : spaceColor
  const borderColor = isDark ? `oklch(0.34 0.10 ${hue})` : `oklch(0.78 0.13 ${hue})`

  // Checkbox colours: vivid hue for both the unchecked border (--input)
  // and the checked fill (--primary)
  const checkboxBorder = isDark ? `oklch(0.65 0.14 ${hue})` : `oklch(0.55 0.15 ${hue})`
  const checkboxPrimary = isDark ? `oklch(0.68 0.18 ${hue})` : `oklch(0.52 0.18 ${hue})`

  function handleCheck(checked: boolean | 'indeterminate') {
    if (checked === true) {
      complete.mutate(item)
    }
  }

  return (
    <>
      <div
        className={cn(
          'group relative flex items-start gap-3 rounded-lg border px-3 py-2.5 shadow-sm transition hover:shadow-md',
        )}
        style={{ background: bgColor, borderColor }}
      >
        {/* Checkbox — primary color scoped to the space hue */}
        <div
          style={
            {
              '--input': checkboxBorder,
              '--primary': checkboxPrimary,
              '--primary-foreground': 'oklch(1 0 0)',
            } as React.CSSProperties
          }
        >
          <Checkbox
            checked={item.completed}
            onCheckedChange={handleCheck}
            disabled={item.completed || complete.isPending}
            className="mt-0.5 shrink-0"
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        {/* Card body → opens edit sheet */}
        <button
          type="button"
          className="min-w-0 flex-1 text-left"
          onClick={() => setEditOpen(true)}
        >
          <p className="line-clamp-2 text-sm font-medium leading-snug text-foreground">
            {item.title}
          </p>
          {item.startDate && (
            <p className="mt-1 flex items-center gap-1 text-xs text-foreground/60">
              <CalendarIcon className="h-3 w-3" />
              {formatDate(item.startDate)}
              {hasExplicitTime(item.startDate) && ` ${formatTime(item.startDate)}`}
              {item.endDate &&
                ` – ${formatDate(item.endDate)}${hasExplicitTime(item.endDate) ? ` ${formatTime(item.endDate)}` : ''}`}
            </p>
          )}
          {item.description && (
            <p className="mt-1 line-clamp-1 text-xs text-foreground/60">
              {item.description}
            </p>
          )}
        </button>
      </div>

      <AddItemSheet
        open={editOpen}
        onOpenChange={setEditOpen}
        spaceId={item.spaceId}
        spaceName={spaceName}
        editItem={item}
        onCreate={() => {}}
        onUpdate={(input) => {
          update.mutate(input, { onSuccess: () => setEditOpen(false) })
        }}
        onComplete={(it) => complete.mutate(it, { onSuccess: () => setEditOpen(false) })}
        onDelete={(it) => remove.mutate(it, { onSuccess: () => setEditOpen(false) })}
        isPending={update.isPending || complete.isPending || remove.isPending}
      />
    </>
  )
}
