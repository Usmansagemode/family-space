import { useState } from 'react'
import { CalendarIcon, GripVertical } from 'lucide-react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Checkbox } from '#/components/ui/checkbox'
import {
  cn,
  formatDate,
  formatTime,
  hasExplicitTime,
  extractHue,
  useIsDark,
} from '#/lib/utils'
import { AddItemSheet } from './AddItemSheet'
import { useItemMutations } from '#/hooks/items/useItemMutations'
import type { Item } from '#/entities/Item'
import type { SpaceType } from '#/entities/Space'

type Props = {
  item: Item
  spaceColor: string
  spaceName: string
  spaceType: SpaceType
}

export function ItemCard({ item, spaceColor, spaceName, spaceType }: Props) {
  const [editOpen, setEditOpen] = useState(false)
  const { complete, update, remove, reAdd } = useItemMutations(item.spaceId)
  const hue = extractHue(spaceColor)
  const isDark = useIsDark()

  const {
    attributes,
    listeners,
    setNodeRef,
    isDragging,
    transform,
    transition,
  } = useSortable({
    id: item.id,
    data: { type: 'item', item, spaceColor },
  })

  // Card colors adapt properly to dark mode
  const bgColor = isDark ? `oklch(0.26 0.08 ${hue})` : spaceColor
  const borderColor = isDark
    ? `oklch(0.34 0.10 ${hue})`
    : `oklch(0.78 0.13 ${hue})`

  // Checkbox: white bg when unchecked, darker space tone when checked, white tick
  const checkboxBorder = isDark
    ? `oklch(0.55 0.12 ${hue})`
    : `oklch(0.60 0.14 ${hue})`
  const checkboxCheckedBg = isDark
    ? `oklch(0.22 0.12 ${hue})`
    : `oklch(0.48 0.20 ${hue})`

  function handleCheck(checked: boolean | 'indeterminate') {
    if (checked === true) {
      complete.mutate(item)
    } else if (checked === false) {
      reAdd.mutate(item)
    }
  }

  return (
    <>
      <div
        ref={setNodeRef}
        className={cn(
          'group relative flex items-center gap-3 rounded-lg border px-3 py-2.5 shadow-sm transition hover:shadow-md',
          isDragging && 'opacity-40',
        )}
        style={{
          background: bgColor,
          borderColor,
          transform: CSS.Transform.toString(transform),
          transition,
        }}
      >
        {/* Drag handle */}
        <button
          type="button"
          className="cursor-grab touch-none text-muted-foreground/30 hover:text-muted-foreground/70 active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-3.5 w-3.5" />
        </button>

        {/* Checkbox — primary color scoped to the space hue */}
        <div
          className="flex"
          style={
            {
              '--input': checkboxBorder,
              '--primary': checkboxCheckedBg,
              '--primary-foreground': 'oklch(1 0 0)',
            } as React.CSSProperties
          }
        >
          <Checkbox
            checked={item.completed}
            onCheckedChange={handleCheck}
            disabled={complete.isPending || reAdd.isPending}
            className="size-5 shrink-0 cursor-pointer rounded-full border-0 bg-white shadow-sm transition-all hover:shadow-[0_0_8px_2px_color-mix(in_oklch,var(--primary)_40%,transparent)] dark:bg-white/90"
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        {/* Card body → opens edit sheet */}
        <button
          type="button"
          className="min-w-0 flex-1 cursor-pointer text-left"
          onClick={() => setEditOpen(true)}
        >
          <p className="line-clamp-2 text-sm font-medium leading-snug text-foreground">
            {item.title}
            {item.quantity && (
              <span className="ml-1.5 text-xs font-normal text-foreground/60">
                × {item.quantity}
              </span>
            )}
          </p>
          {item.startDate && (
            <p className="mt-1 flex items-center gap-1 text-xs text-foreground/60">
              <CalendarIcon className="h-3 w-3" />
              {formatDate(item.startDate)}
              {hasExplicitTime(item.startDate) &&
                ` ${formatTime(item.startDate)}`}
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
        spaceType={spaceType}
        editItem={item}
        onCreate={() => {}}
        onUpdate={(input) => {
          update.mutate(input, { onSuccess: () => setEditOpen(false) })
        }}
        onComplete={(it) =>
          complete.mutate(it, { onSuccess: () => setEditOpen(false) })
        }
        onDelete={(it) =>
          remove.mutate(it, { onSuccess: () => setEditOpen(false) })
        }
        isPending={update.isPending || complete.isPending || remove.isPending}
      />
    </>
  )
}
