import { useState, useEffect, useCallback, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CalendarIcon, Clock, Loader2 } from 'lucide-react'
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

const schema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(500).optional(),
})
type FormData = z.infer<typeof schema>

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  spaceId: string
  spaceName: string
  editItem?: Item
  onCreate: (input: {
    title: string
    description?: string
    startDate?: Date
    endDate?: Date
  }) => void
  onUpdate?: (input: {
    id: string
    title: string
    description?: string
    startDate?: Date
    endDate?: Date
  }) => void
  onComplete?: (item: Item) => void
  onDelete?: (item: Item) => void
  isPending: boolean
}

export function AddItemSheet({
  open,
  onOpenChange,
  spaceId,
  spaceName,
  editItem,
  onCreate,
  onUpdate,
  onComplete,
  onDelete,
  isPending,
}: Props) {
  const isEditing = !!editItem
  const [startDate, setStartDate] = useState<Date | undefined>(editItem?.startDate)
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

  const { register, handleSubmit, reset, formState, watch, setValue } =
    useForm<FormData>({
      resolver: zodResolver(schema),
      defaultValues: {
        title: editItem?.title ?? '',
        description: editItem?.description ?? '',
      },
    })

  const titleValue = watch('title')
  const titleField = register('title')

  // Pull completed items from cache (already loaded by SpaceColumn)
  const { data: allItems } = useItems(spaceId)

  // Deduplicated history: one entry per unique title (case-insensitive), newest first
  const suggestions = useMemo(() => {
    if (!allItems || isEditing) return []
    const seen = new Set<string>()
    return allItems
      .filter((i) => i.completed)
      .sort((a, b) => (b.completedAt?.getTime() ?? 0) - (a.completedAt?.getTime() ?? 0))
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
      setShowSuggestions(false)
    }
  }, [open, editItem, reset])

  function onSubmit(data: FormData) {
    const description = data.description?.trim() || undefined
    if (isEditing && editItem && onUpdate) {
      onUpdate({ id: editItem.id, title: data.title, description, startDate, endDate })
    } else {
      onCreate({ title: data.title, description, startDate, endDate })
    }
    // Sheet stays open — parent closes it in mutation's onSuccess
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

          {/* Start date + time */}
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
                    {startDate ? format(startDate, 'MMM d, yyyy') : 'Pick a date'}
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

              {/* Start time — only shown once a date is picked */}
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

          {/* End date + time — only shown if start date is set */}
          {startDate && (
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

              {/* End time — only shown once end date is picked */}
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
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => onOpenChange(false)}
              >
                Cancel
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
