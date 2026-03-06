import { useState } from 'react'
import { useSortable, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  User,
  ShoppingCart,
  MoreHorizontal,
  Plus,
  History,
  GripVertical,
} from 'lucide-react'
import { cn, extractHue, useIsDark } from '#/lib/utils'
import { Button } from '#/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu'
import { Skeleton } from '#/components/ui/skeleton'
import { ItemCard } from './ItemCard'
import { AddItemSheet } from './AddItemSheet'
import { HistorySheet } from './HistorySheet'
import { AddSpaceSheet } from './AddSpaceSheet'
import { useItems } from '#/hooks/items/useItems'
import { useItemMutations } from '#/hooks/items/useItemMutations'
import { useSpaceMutations } from '#/hooks/spaces/useSpaceMutations'
import type { Space } from '#/entities/Space'

type Props = {
  space: Space
  familyId: string
  isDropTarget?: boolean
}

export function SpaceColumn({ space, familyId, isDropTarget }: Props) {
  const [addItemOpen, setAddItemOpen] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [editSpaceOpen, setEditSpaceOpen] = useState(false)

  const { data: items, isLoading } = useItems(space.id)
  const { create: createItem } = useItemMutations(space.id)
  const { update: updateSpace, remove: removeSpace } =
    useSpaceMutations(familyId)

  const hue = extractHue(space.color)
  const isDark = useIsDark()
  const accentColor = isDark
    ? `oklch(0.62 0.16 ${hue})`
    : `oklch(0.68 0.14 ${hue})`

  const today = new Date()
  const activeItems = (items ?? []).filter(
    (i) =>
      !i.completed ||
      (i.completedAt &&
        i.completedAt.getFullYear() === today.getFullYear() &&
        i.completedAt.getMonth() === today.getMonth() &&
        i.completedAt.getDate() === today.getDate()),
  )
  const pendingCount = (items ?? []).filter((i) => !i.completed).length
  const completedCount = (items ?? []).filter((i) => i.completed).length

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: space.id, data: { type: 'space' } })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <>
      <div
        ref={setNodeRef}
        style={{
          ...style,
          borderTop: `3px solid ${accentColor}`,
          ...(isDropTarget && {
            boxShadow: `0 0 0 2px ${accentColor}`,
          }),
        }}
        className={cn(
          'flex w-full flex-col rounded-xl bg-card shadow-sm ring-1 ring-border transition-shadow dark:shadow-[0_2px_12px_rgba(0,0,0,0.35)] sm:h-full sm:w-72 sm:shrink-0',
          isDropTarget && 'bg-card/80',
        )}
      >
        {/* Header */}
        <div className="flex items-center gap-2 px-3 pt-3 pb-1">
          {/* Drag handle */}
          <button
            type="button"
            className="cursor-grab touch-none text-muted-foreground/40 hover:text-muted-foreground active:cursor-grabbing"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-4 w-4" />
          </button>

          {/* Color dot */}
          <span
            className="h-2.5 w-2.5 shrink-0 rounded-full"
            style={{ background: space.color }}
          />

          {/* Space icon */}
          {space.type === 'person' ? (
            <User className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          ) : (
            <ShoppingCart className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          )}

          {/* Name */}
          <span className="min-w-0 flex-1 truncate text-sm font-semibold">
            {space.name}
          </span>

          {/* Pending count badge */}
          {!isLoading && pendingCount > 0 && (
            <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium tabular-nums text-muted-foreground">
              {pendingCount}
            </span>
          )}

          {/* Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setEditSpaceOpen(true)}>
                Edit space
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => removeSpace.mutate(space.id)}
              >
                Delete space
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* History link */}
        <button
          type="button"
          onClick={() => setHistoryOpen(true)}
          className="mx-3 mb-2 flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground/70 transition hover:bg-muted hover:text-muted-foreground"
        >
          <History className="h-3 w-3" />
          History
          {completedCount > 0 && (
            <span className="ml-auto rounded-full bg-muted px-1.5 py-0.5 text-[10px]">
              {completedCount}
            </span>
          )}
        </button>

        {/* Items list */}
        <div className="min-h-0 flex-1 overflow-y-auto px-3 max-sm:flex-none max-sm:overflow-visible">
          <div className="flex flex-col gap-2 pb-2">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full rounded-lg" />
              ))
            ) : activeItems.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-8 text-center">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full"
                  style={{ background: space.color }}
                >
                  {space.type === 'person' ? (
                    <User className="h-5 w-5" style={{ color: accentColor }} />
                  ) : (
                    <ShoppingCart className="h-5 w-5" style={{ color: accentColor }} />
                  )}
                </div>
                <div className="flex flex-col items-center gap-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    {space.type === 'person' ? 'No tasks yet' : 'Nothing on the list'}
                  </p>
                  <button
                    type="button"
                    className="text-xs text-muted-foreground/60 transition hover:text-foreground"
                    onClick={() => setAddItemOpen(true)}
                  >
                    Add the first item →
                  </button>
                </div>
              </div>
            ) : (
              <SortableContext
                items={activeItems.map((i) => i.id)}
                strategy={verticalListSortingStrategy}
              >
                {activeItems.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    spaceColor={space.color}
                    spaceName={space.name}
                    spaceType={space.type}
                    familyId={familyId}
                  />
                ))}
              </SortableContext>
            )}
          </div>
        </div>

        {/* Add item button */}
        <div className="p-3 pt-0">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
            onClick={() => setAddItemOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Add item
          </Button>
        </div>
      </div>

      {/* Sheets */}
      <AddItemSheet
        open={addItemOpen}
        onOpenChange={setAddItemOpen}
        spaceId={space.id}
        spaceName={space.name}
        spaceType={space.type}
        onCreate={(input) => {
          createItem.mutate(input)
        }}
        isPending={createItem.isPending}
      />

      <HistorySheet
        open={historyOpen}
        onOpenChange={setHistoryOpen}
        spaceId={space.id}
        spaceName={space.name}
      />

      <AddSpaceSheet
        open={editSpaceOpen}
        onOpenChange={setEditSpaceOpen}
        editSpace={space}
        onCreate={() => {}}
        onUpdate={(input) =>
          updateSpace.mutate(input, {
            onSuccess: () => setEditSpaceOpen(false),
          })
        }
        isPending={updateSpace.isPending}
      />
    </>
  )
}
