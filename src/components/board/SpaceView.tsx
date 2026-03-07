import { useEffect, useState } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import type {
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  horizontalListSortingStrategy,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Plus, ShoppingCart, User, X } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '#/components/ui/tooltip'
import { Button } from '#/components/ui/button'
import { Skeleton } from '#/components/ui/skeleton'
import { ItemCard } from './ItemCard'
import { SpaceColumn } from './SpaceColumn'
import { AddSpaceSheet } from './AddSpaceSheet'
import { useSpaces } from '#/hooks/spaces/useSpaces'
import { useSpaceMutations } from '#/hooks/spaces/useSpaceMutations'
import { moveItem, reorderItems } from '#/lib/supabase/items'
import { BoardProvider } from '#/contexts/board'
import { extractHue, useIsDark } from '#/lib/utils'
import type { Space } from '#/entities/Space'
import type { Item } from '#/entities/Item'
import { useItems } from '#/hooks/items/useItems'

type Props = {
  familyId: string
  providerToken: string | null
  calendarId: string | null
}

type ActiveDragItem = { item: Item; spaceColor: string }

export function SpaceView({ familyId, providerToken, calendarId }: Props) {
  const [addSpaceOpen, setAddSpaceOpen] = useState(false)
  const [focusedSpaceId, setFocusedSpaceId] = useState<string | null>(null)
  const [activeDragItem, setActiveDragItem] = useState<ActiveDragItem | null>(
    null,
  )
  const [overSpaceId, setOverSpaceId] = useState<string | null>(null)

  const { data: spaces, isLoading } = useSpaces(familyId)
  const { create, reorder } = useSpaceMutations(familyId)
  const queryClient = useQueryClient()

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  )

  const moveItemMutation = useMutation({
    mutationFn: ({
      item,
      newSpaceId,
    }: {
      item: Item
      newSpaceId: string
    }) => moveItem(item.id, newSpaceId),
    onError: (_err, { item, newSpaceId }) => {
      queryClient.setQueryData<Item[]>(
        ['items', newSpaceId],
        (old) => old?.filter((i) => i.id !== item.id) ?? [],
      )
      queryClient.setQueryData<Item[]>(
        ['items', item.spaceId],
        (old) => [item, ...(old ?? [])],
      )
      toast.error('Failed to move item')
    },
    onSettled: (_data, _err, { item, newSpaceId }) => {
      void queryClient.invalidateQueries({ queryKey: ['items', item.spaceId] })
      void queryClient.invalidateQueries({ queryKey: ['items', newSpaceId] })
    },
  })

  const reorderItemsMutation = useMutation({
    mutationFn: ({
      spaceId,
      orderedIds,
    }: {
      spaceId: string
      orderedIds: string[]
    }) => reorderItems(spaceId, orderedIds),
    onError: (_err, { spaceId }) => {
      void queryClient.invalidateQueries({ queryKey: ['items', spaceId] })
      toast.error('Failed to reorder items')
    },
  })

  function handleDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === 'item') {
      setActiveDragItem({
        item: event.active.data.current.item as Item,
        spaceColor: event.active.data.current.spaceColor as string,
      })
    }
  }

  function handleDragOver(event: DragOverEvent) {
    if (event.active.data.current?.type === 'item') {
      const overType = event.over?.data.current?.type
      if (overType === 'space') {
        setOverSpaceId(event.over!.id as string)
      } else if (overType === 'item') {
        setOverSpaceId(
          (event.over?.data.current?.item as Item | undefined)?.spaceId ?? null,
        )
      } else {
        setOverSpaceId(null)
      }
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveDragItem(null)
    setOverSpaceId(null)

    const { active, over } = event
    if (!over) return

    const activeType = active.data.current?.type

    if (activeType === 'space') {
      if (active.id === over.id || !spaces) return
      const oldIndex = spaces.findIndex((s) => s.id === active.id)
      const newIndex = spaces.findIndex((s) => s.id === over.id)
      if (oldIndex === -1 || newIndex === -1) return
      const reordered = arrayMove(spaces, oldIndex, newIndex)
      queryClient.setQueryData<Space[]>(['spaces', familyId], reordered)
      reorder.mutate(reordered.map((s) => s.id))
    } else if (activeType === 'item') {
      const draggedItem = active.data.current?.item as Item
      const overType = over.data.current?.type

      // Determine target space ID
      let targetSpaceId: string
      if (overType === 'space') {
        targetSpaceId = over.id as string
      } else if (overType === 'item') {
        targetSpaceId = (over.data.current?.item as Item).spaceId
      } else {
        return
      }

      const sourceSpace = spaces?.find((s) => s.id === draggedItem.spaceId)
      const targetSpace = spaces?.find((s) => s.id === targetSpaceId)
      if (!sourceSpace || !targetSpace) return

      if (draggedItem.spaceId === targetSpaceId && overType === 'item') {
        // Same column — reorder
        const overItem = over.data.current?.item as Item
        const allItems =
          queryClient.getQueryData<Item[]>(['items', draggedItem.spaceId]) ?? []
        const oldIdx = allItems.findIndex((i) => i.id === draggedItem.id)
        const newIdx = allItems.findIndex((i) => i.id === overItem.id)
        if (oldIdx === -1 || newIdx === -1 || oldIdx === newIdx) return
        const reordered = arrayMove(allItems, oldIdx, newIdx)
        queryClient.setQueryData<Item[]>(['items', draggedItem.spaceId], reordered)
        reorderItemsMutation.mutate({
          spaceId: draggedItem.spaceId,
          orderedIds: reordered.map((i) => i.id),
        })
      } else if (draggedItem.spaceId !== targetSpaceId) {
        // Cross-space move
        if (sourceSpace.type !== targetSpace.type) return
        queryClient.setQueryData<Item[]>(
          ['items', draggedItem.spaceId],
          (old) => old?.filter((i) => i.id !== draggedItem.id) ?? [],
        )
        queryClient.setQueryData<Item[]>(
          ['items', targetSpaceId],
          (old) => [{ ...draggedItem, spaceId: targetSpaceId }, ...(old ?? [])],
        )
        moveItemMutation.mutate({ item: draggedItem, newSpaceId: targetSpaceId })
      }
    }
  }

  function handleDragCancel() {
    setActiveDragItem(null)
    setOverSpaceId(null)
  }

  return (
    <BoardProvider
      familyId={familyId}
      providerToken={providerToken}
      calendarId={calendarId}
    >
      <div className="flex h-full flex-col">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <div className="flex h-full flex-col gap-4 overflow-y-auto bg-muted/30 p-4 pb-6 sm:flex-row sm:overflow-x-auto sm:overflow-y-hidden">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="flex h-48 w-full flex-col gap-3 rounded-xl border border-border bg-muted/30 p-3 sm:h-full sm:w-72 sm:shrink-0"
                >
                  <Skeleton className="h-1 w-full rounded-t-xl" />
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-14 w-full rounded-lg" />
                  <Skeleton className="h-14 w-full rounded-lg" />
                </div>
              ))
            ) : (
              <SortableContext
                items={(spaces ?? []).map((s) => s.id)}
                strategy={horizontalListSortingStrategy}
              >
                {(spaces ?? []).map((space) => (
                  <SpaceColumn
                    key={space.id}
                    space={space}
                    familyId={familyId}
                    isDropTarget={
                      activeDragItem !== null &&
                      overSpaceId === space.id &&
                      spaces?.find(
                        (s) => s.id === activeDragItem.item.spaceId,
                      )?.type === space.type
                    }
                    onFocus={() => setFocusedSpaceId(space.id)}
                  />
                ))}
              </SortableContext>
            )}

            {/* Add Space button */}
            {!isLoading && (
              <div className="flex shrink-0 items-start pt-1">
                <Button
                  variant="outline"
                  className="gap-2 whitespace-nowrap"
                  onClick={() => setAddSpaceOpen(true)}
                >
                  <Plus className="h-4 w-4" />
                  Add Space
                </Button>
              </div>
            )}
          </div>

          <DragOverlay>
            {activeDragItem ? (
              <ItemDragOverlay
                item={activeDragItem.item}
                spaceColor={activeDragItem.spaceColor}
              />
            ) : null}
          </DragOverlay>
        </DndContext>

        <AddSpaceSheet
          open={addSpaceOpen}
          onOpenChange={setAddSpaceOpen}
          onCreate={(input) => {
            create.mutate(input, { onSuccess: () => setAddSpaceOpen(false) })
          }}
          isPending={create.isPending}
        />
      </div>

      {focusedSpaceId && (() => {
        const focusedSpace = spaces?.find((s) => s.id === focusedSpaceId)
        return focusedSpace ? (
          <FocusOverlay
            space={focusedSpace}
            familyId={familyId}
            onClose={() => setFocusedSpaceId(null)}
          />
        ) : null
      })()}
    </BoardProvider>
  )
}

function FocusOverlay({
  space,
  familyId,
  onClose,
}: {
  space: Space
  familyId: string
  onClose: () => void
}) {
  const { data: items, isLoading } = useItems(space.id)
  const hue = extractHue(space.color)
  const isDark = useIsDark()

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const today = new Date()
  const activeItems = (items ?? []).filter(
    (i) =>
      !i.completed ||
      (i.completedAt &&
        i.completedAt.getFullYear() === today.getFullYear() &&
        i.completedAt.getMonth() === today.getMonth() &&
        i.completedAt.getDate() === today.getDate()),
  )

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      {/* Header */}
      <div
        className="flex shrink-0 items-center gap-2.5 px-4 py-3"
        style={{ background: isDark ? `oklch(0.22 0.05 ${hue})` : space.color }}
      >
        {space.type === 'person' ? (
          <User className="h-4 w-4 shrink-0 opacity-60" />
        ) : (
          <ShoppingCart className="h-4 w-4 shrink-0 opacity-60" />
        )}
        <span className="flex-1 text-base font-bold">{space.name}</span>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full opacity-60 transition hover:bg-black/10 hover:opacity-100 dark:hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>Exit focus mode</TooltipContent>
        </Tooltip>
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="mx-auto flex max-w-lg flex-col gap-3">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-xl" />
            ))
          ) : activeItems.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-16 text-center">
              <p className="text-sm font-medium text-muted-foreground">
                {space.type === 'person' ? 'No tasks yet' : 'Nothing on the list'}
              </p>
            </div>
          ) : (
            <DndContext sensors={[]}>
              <SortableContext
                items={activeItems.map((i) => i.id)}
                strategy={verticalListSortingStrategy}
              >
                {activeItems.map((item, index) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    spaceColor={space.color}
                    spaceName={space.name}
                    spaceType={space.type}
                    familyId={familyId}
                    index={index}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>
    </div>
  )
}

function ItemDragOverlay({
  item,
  spaceColor,
}: {
  item: Item
  spaceColor: string
}) {
  const hue = extractHue(spaceColor)
  const isDark = useIsDark()
  const cardBg = isDark ? `oklch(0.22 0.07 ${hue})` : spaceColor
  const cardBorder = isDark
    ? `oklch(0.30 0.09 ${hue})`
    : `oklch(0.82 0.09 ${hue})`

  return (
    <div
      className="flex w-72 items-center gap-3 rounded-xl border px-3.5 py-3 shadow-xl rotate-1 cursor-grabbing"
      style={{ background: cardBg, borderColor: cardBorder }}
    >
      <div className="flex size-[18px] shrink-0 rounded-full bg-white" />
      <p className="text-sm font-medium leading-snug text-foreground">
        {item.title}
        {item.quantity && (
          <span className="ml-1.5 text-xs font-normal text-foreground/60">
            × {item.quantity}
          </span>
        )}
      </p>
    </div>
  )
}
