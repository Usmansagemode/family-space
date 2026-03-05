import { useState, useEffect, useCallback, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchSpaces } from '#/lib/supabase/spaces'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CalendarIcon, Clock, Loader2, Hash } from 'lucide-react'
import { format } from 'date-fns'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '#/components/ui/sheet'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { Textarea } from '#/components/ui/textarea'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '#/components/ui/popover'
import { cn, hasExplicitTime } from '#/lib/utils'
import { useItems } from '#/hooks/items/useItems'
import type { Item } from '#/entities/Item'
import type { SpaceType } from '#/entities/Space'

const schema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(500).optional(),
  quantity: z.string().max(50).optional(),
})
type FormData = z.infer<typeof schema>

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  spaceId: string
  spaceName: string
  spaceType: SpaceType
  familyId?: string
  editItem?: Item
  onCreate: (input: {
    title: string
    description?: string
    quantity?: string
    startDate?: Date
    endDate?: Date
  }) => void
  onUpdate?: (input: {
    id: string
    title: string
    description?: string
    quantity?: string | null
    startDate?: Date
    endDate?: Date
  }) => void
  onComplete?: (item: Item) => void
  onDelete?: (item: Item) => void
  onMove?: (newSpaceId: string) => void
  isPending: boolean
}

export function AddItemSheet({
  open,
  onOpenChange,
  spaceId,
  spaceName,
  spaceType,
  familyId,
  editItem,
  onCreate,
  onUpdate,
  onComplete,
  onDelete,
  onMove,
  isPending,
}: Props) {
  const isStore = spaceType === 'store'
  const isEditing = !!editItem
  const [moveToSpaceId, setMoveToSpaceId] = useState('')

  const { data: allSpaces } = useQuery({
    queryKey: ['spaces', familyId],
    queryFn: () => fetchSpaces(familyId!),
    enabled: isEditing && !!familyId,
    staleTime: 1000 * 60 * 5,
  })
  const otherSpaces = (allSpaces ?? []).filter(
    (s) => s.type === spaceType && s.id !== spaceId,
  )

  const [startDate, setStartDate] = useState<Date | undefined>(
    editItem?.startDate,
  )
  const [endDate, setEndDate] = useState<Date | undefined>(editItem?.endDate)
  const [startTimeStr, setStartTimeStr] = useState(
    editItem?.startDate && hasExplicitTime(editItem.startDate)
      ? format(editItem.startDate, 'HH:mm')
      : '',
  )
  const [endTimeStr, setEndTimeStr] = useState(
    editItem?.endDate && hasExplicitTime(editItem.endDate)
      ? format(editItem.endDate, 'HH:mm')
      : '',
  )
  const [startOpen, setStartOpen] = useState(false)
  const [endOpen, setEndOpen] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [lastAddedTitle, setLastAddedTitle] = useState<string | null>(null)

  const { register, handleSubmit, reset, formState, watch, setValue } =
    useForm<FormData>({
      resolver: zodResolver(schema),
      defaultValues: {
        title: editItem?.title ?? '',
        description: editItem?.description ?? '',
        quantity: editItem?.quantity ?? '',
      },
    })

  const titleValue = watch('title')
  const titleField = register('title', {
    onChange: () => setLastAddedTitle(null),
  })

  // Pull completed items from cache (already loaded by SpaceColumn)
  const { data: allItems } = useItems(spaceId)

  // Deduplicated history: one entry per unique title (case-insensitive), newest first
  const suggestions = useMemo(() => {
    if (!allItems || isEditing) return []
    const seen = new Set<string>()
    return allItems
      .filter((i) => i.completed)
      .sort(
        (a, b) =>
          (b.completedAt?.getTime() ?? 0) - (a.completedAt?.getTime() ?? 0),
      )
      .filter((i) => {
        const key = i.title.toLowerCase()
        if (seen.has(key)) return false
        seen.add(key)
        return true
      })
      .filter(
        (i) =>
          !titleValue.trim() ||
          i.title.toLowerCase().includes(titleValue.toLowerCase()),
      )
      .slice(0, 6)
  }, [allItems, titleValue, isEditing])

  useEffect(() => {
    if (open) {
      reset({
        title: editItem?.title ?? '',
        description: editItem?.description ?? '',
        quantity: editItem?.quantity ?? '',
      })
      setStartDate(editItem?.startDate)
      setEndDate(editItem?.endDate)
      setStartTimeStr(
        editItem?.startDate && hasExplicitTime(editItem.startDate)
          ? format(editItem.startDate, 'HH:mm')
          : '',
      )
      setEndTimeStr(
        editItem?.endDate && hasExplicitTime(editItem.endDate)
          ? format(editItem.endDate, 'HH:mm')
          : '',
      )
      setMoveToSpaceId('')
      setLastAddedTitle(null)
      // Show suggestions immediately when creating (not editing)
      setShowSuggestions(!editItem)
    }
  }, [open, editItem, reset])

  function onSubmit(data: FormData) {
    const description = data.description?.trim() || undefined
    const quantity = isStore ? data.quantity?.trim() || undefined : undefined
    if (isEditing && editItem && onUpdate) {
      onUpdate({
        id: editItem.id,
        title: data.title,
        description,
        quantity: isStore ? (quantity ?? null) : undefined,
        startDate: isStore ? undefined : startDate,
        endDate: isStore ? undefined : endDate,
      })
      // Sheet stays open — parent closes it in mutation's onSuccess
    } else {
      const addedTitle = data.title
      onCreate({
        title: addedTitle,
        description,
        quantity,
        startDate: isStore ? undefined : startDate,
        endDate: isStore ? undefined : endDate,
      })
      // Quick-add: reset form and stay open for the next item
      reset({ title: '', description: '', quantity: '' })
      setStartDate(undefined)
      setEndDate(undefined)
      setStartTimeStr('')
      setEndTimeStr('')
      setLastAddedTitle(addedTitle)
      setShowSuggestions(true)
    }
  }

  const handleComplete = useCallback(() => {
    if (editItem && onComplete) {
      onComplete(editItem)
      // Sheet stays open — parent closes it in mutation's onSuccess
    }
  }, [editItem, onComplete])

  function handleDelete() {
    if (editItem && onDelete) {
      onDelete(editItem)
      // Sheet stays open — parent closes it in mutation's onSuccess
    }
  }

  function pickSuggestion(title: string) {
    setValue('title', title, { shouldValidate: true })
    setShowSuggestions(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex max-w-sm flex-col gap-0 p-0">
        <SheetHeader className="border-b border-border p-6">
          <SheetTitle>
            {isEditing ? editItem.title : `Add to ${spaceName}`}
          </SheetTitle>
        </SheetHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-1 flex-col gap-5 overflow-y-auto p-6"
        >
          {/* Title + history suggestions */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="item-title">Title</Label>
            <Input
              id="item-title"
              placeholder="What needs doing?"
              autoFocus
              autoComplete="off"
              {...titleField}
              onFocus={() => setShowSuggestions(true)}
              onBlur={(e) => {
                void titleField.onBlur(e)
                // Small delay so onMouseDown on suggestions fires first
                setTimeout(() => setShowSuggestions(false), 120)
              }}
            />
            {formState.errors.title && (
              <p className="text-xs text-destructive">
                {formState.errors.title.message}
              </p>
            )}

            {/* History suggestions dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="overflow-hidden rounded-md border border-border bg-popover shadow-md">
                <p className="border-b border-border px-3 py-1.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  From history
                </p>
                {suggestions.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault()
                      pickSuggestion(item.title)
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition hover:bg-accent"
                  >
                    <Clock className="h-3 w-3 shrink-0 text-muted-foreground" />
                    <span className="flex-1 truncate">{item.title}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quantity — store spaces only */}
          {isStore && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="item-qty">Quantity (optional)</Label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="item-qty"
                  placeholder="e.g. 2, 500g, 1 dozen"
                  className="pl-9"
                  {...register('quantity')}
                />
              </div>
            </div>
          )}

          {/* Start date + time — person spaces only */}
          {!isStore && (
            <div className="flex flex-col gap-2">
              <Label>Date (optional)</Label>
              <div className="flex gap-2">
                <Popover open={startOpen} onOpenChange={setStartOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        'flex-1 justify-start text-left font-normal',
                        !startDate && 'text-muted-foreground',
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate
                        ? format(startDate, 'MMM d, yyyy')
                        : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <input
                      type="date"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={startDate ? format(startDate, 'yyyy-MM-dd') : ''}
                      onChange={(e) => {
                        if (e.target.value) {
                          const d = new Date(e.target.value + 'T12:00:00')
                          if (startTimeStr) {
                            const [h, m] = startTimeStr.split(':').map(Number)
                            d.setHours(h, m, 0, 0)
                          }
                          setStartDate(d)
                        } else {
                          setStartDate(undefined)
                          setEndDate(undefined)
                          setStartTimeStr('')
                          setEndTimeStr('')
                        }
                        setStartOpen(false)
                      }}
                    />
                  </PopoverContent>
                </Popover>

                {startDate && (
                  <input
                    type="time"
                    className="w-28 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={startTimeStr}
                    onChange={(e) => {
                      const t = e.target.value
                      setStartTimeStr(t)
                      const updated = new Date(startDate)
                      if (t) {
                        const [h, m] = t.split(':').map(Number)
                        updated.setHours(h, m, 0, 0)
                      } else {
                        updated.setHours(12, 0, 0, 0)
                      }
                      setStartDate(updated)
                    }}
                  />
                )}
              </div>
              {startDate && (
                <button
                  type="button"
                  className="self-start text-xs text-muted-foreground hover:text-foreground"
                  onClick={() => {
                    setStartDate(undefined)
                    setEndDate(undefined)
                    setStartTimeStr('')
                    setEndTimeStr('')
                  }}
                >
                  Clear date
                </button>
              )}
            </div>
          )}

          {/* End date + time — person spaces only, shown if start date is set */}
          {!isStore && startDate && (
            <div className="flex flex-col gap-2">
              <Label>End date / time (optional)</Label>
              <div className="flex gap-2">
                <Popover open={endOpen} onOpenChange={setEndOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        'flex-1 justify-start text-left font-normal',
                        !endDate && 'text-muted-foreground',
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, 'MMM d, yyyy') : 'End date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <input
                      type="date"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={endDate ? format(endDate, 'yyyy-MM-dd') : ''}
                      min={format(startDate, 'yyyy-MM-dd')}
                      onChange={(e) => {
                        if (e.target.value) {
                          const d = new Date(e.target.value + 'T12:00:00')
                          if (endTimeStr) {
                            const [h, m] = endTimeStr.split(':').map(Number)
                            d.setHours(h, m, 0, 0)
                          }
                          setEndDate(d)
                        } else {
                          setEndDate(undefined)
                          setEndTimeStr('')
                        }
                        setEndOpen(false)
                      }}
                    />
                  </PopoverContent>
                </Popover>

                {endDate && (
                  <input
                    type="time"
                    className="w-28 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={endTimeStr}
                    onChange={(e) => {
                      const t = e.target.value
                      setEndTimeStr(t)
                      const updated = new Date(endDate)
                      if (t) {
                        const [h, m] = t.split(':').map(Number)
                        updated.setHours(h, m, 0, 0)
                      } else {
                        updated.setHours(12, 0, 0, 0)
                      }
                      setEndDate(updated)
                    }}
                  />
                )}
              </div>
            </div>
          )}

          {/* Move to space — edit mode only, when other same-type spaces exist */}
          {isEditing && onMove && otherSpaces.length > 0 && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="item-move">Move to space</Label>
              <div className="flex gap-2">
                <select
                  id="item-move"
                  value={moveToSpaceId}
                  onChange={(e) => setMoveToSpaceId(e.target.value)}
                  className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="">— {spaceName} (current) —</option>
                  {otherSpaces.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                {moveToSpaceId && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onMove(moveToSpaceId)}
                    disabled={isPending}
                  >
                    Move
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="item-desc">Notes (optional)</Label>
            <Textarea
              id="item-desc"
              placeholder="Any extra details…"
              rows={3}
              {...register('description')}
            />
          </div>

          <div className="mt-auto flex flex-col gap-2">
            {isEditing && onComplete && (
              <Button
                type="button"
                variant="outline"
                className="w-full border-green-200 text-green-600 hover:border-green-400 hover:bg-green-50 hover:text-green-600 dark:border-green-800 dark:hover:bg-green-950"
                onClick={handleComplete}
                disabled={isPending}
              >
                Mark as Done
              </Button>
            )}
            {isEditing && onDelete && (
              <Button
                type="button"
                variant="outline"
                className="w-full border-destructive/30 text-destructive hover:border-destructive hover:bg-destructive/5"
                onClick={handleDelete}
                disabled={isPending}
              >
                Delete
              </Button>
            )}

            {/* Inline confirmation for quick-add */}
            {!isEditing && lastAddedTitle && (
              <p className="text-center text-xs text-muted-foreground">
                <span className="font-medium text-foreground">
                  "{lastAddedTitle}"
                </span>{' '}
                added
              </p>
            )}

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => onOpenChange(false)}
              >
                {isEditing ? 'Cancel' : 'Done'}
              </Button>
              <Button type="submit" className="flex-1" disabled={isPending}>
                {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                {isEditing ? 'Save' : 'Add'}
              </Button>
            </div>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
