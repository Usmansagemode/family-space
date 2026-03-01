import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  horizontalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { Plus } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Skeleton } from '#/components/ui/skeleton'
import { SpaceColumn } from './SpaceColumn'
import { AddSpaceSheet } from './AddSpaceSheet'
import { useSpaces } from '#/hooks/spaces/useSpaces'
import { useSpaceMutations } from '#/hooks/spaces/useSpaceMutations'
import { useQueryClient } from '@tanstack/react-query'
import { BoardProvider } from '#/contexts/board'
import type { Space } from '#/entities/Space'

type Props = {
  familyId: string
  providerToken: string | null
  calendarId: string | null
}

export function BoardView({ familyId, providerToken, calendarId }: Props) {
  const [addSpaceOpen, setAddSpaceOpen] = useState(false)
  const { data: spaces, isLoading } = useSpaces(familyId)
  const { create, reorder } = useSpaceMutations(familyId)
  const queryClient = useQueryClient()

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id || !spaces) return

    const oldIndex = spaces.findIndex((s) => s.id === active.id)
    const newIndex = spaces.findIndex((s) => s.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return

    const reordered = arrayMove(spaces, oldIndex, newIndex)

    // Optimistic update
    queryClient.setQueryData<Space[]>(['spaces', familyId], reordered)

    reorder.mutate(reordered.map((s) => s.id))
  }

  return (
    <BoardProvider familyId={familyId} providerToken={providerToken} calendarId={calendarId}>
      <div className="flex h-full flex-col">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="flex h-full gap-4 overflow-x-auto p-4 pb-6">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="flex h-full w-72 shrink-0 flex-col gap-3 rounded-xl border border-border bg-muted/30 p-3"
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
    </BoardProvider>
  )
}
