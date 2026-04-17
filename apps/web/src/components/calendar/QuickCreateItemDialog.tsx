import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { CalendarIcon, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { createItem } from '@family/supabase'
import { useSpaces } from '@family/hooks'
import type { Space } from '@family/types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '#/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '#/components/ui/popover'
import { cn } from '#/lib/utils'

const CALENDAR_SPACE_TYPES = ['person', 'chore'] as const

const lastSpaceKey = (familyId: string) => `calendar-last-space:${familyId}`

const schema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  spaceId: z.string().min(1, 'Space is required'),
  date: z.date().optional(),
})
type FormData = z.infer<typeof schema>

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  familyId: string
  initialDate?: Date
}

function SpaceRow({ space }: { space: Space }) {
  return (
    <span className="flex items-center gap-2">
      <span
        className="inline-block h-2 w-2 flex-shrink-0 rounded-full"
        style={{ backgroundColor: space.color }}
      />
      {space.name}
    </span>
  )
}

export function QuickCreateItemDialog({ open, onOpenChange, familyId, initialDate }: Props) {
  const queryClient = useQueryClient()
  const { data: spaces = [] } = useSpaces(familyId)
  const initializedRef = useRef(false)
  const [datePickerOpen, setDatePickerOpen] = useState(false)

  const calendarSpaces = useMemo(
    () => spaces.filter((s) => (CALENDAR_SPACE_TYPES as readonly string[]).includes(s.type)),
    [spaces],
  )

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { title: '', spaceId: '', date: undefined },
  })

  const spaceId = watch('spaceId')
  const date = watch('date')

  // Initialize form once when dialog opens and spaces are loaded
  useEffect(() => {
    if (!open) {
      initializedRef.current = false
      return
    }
    if (initializedRef.current) return
    if (calendarSpaces.length === 0) return // wait for spaces to load

    const savedSpaceId = localStorage.getItem(lastSpaceKey(familyId)) ?? ''
    const validSaved = calendarSpaces.find((s) => s.id === savedSpaceId)
    const defaultSpaceId = validSaved?.id ?? calendarSpaces[0]?.id ?? ''

    reset({ title: '', spaceId: defaultSpaceId, date: initialDate })
    initializedRef.current = true
  }, [open, initialDate, calendarSpaces, familyId, reset])

  const create = useMutation({
    mutationFn: ({ title, spaceId: sid, date: d }: FormData) =>
      createItem({ spaceId: sid, title, startDate: d }),
    onSuccess: (_data, vars) => {
      localStorage.setItem(lastSpaceKey(familyId), vars.spaceId)
      void queryClient.invalidateQueries({ queryKey: ['calendar-items'] })
      void queryClient.invalidateQueries({ queryKey: ['upcoming-items', familyId] })
      toast.success('Item added')
      onOpenChange(false)
    },
    onError: () => {
      toast.error('Failed to add item')
    },
  })

  const selectedSpace = calendarSpaces.find((s) => s.id === spaceId)
  const noSpaces = calendarSpaces.length === 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>
            {date ? `Add item — ${format(date, 'MMM d')}` : 'Add item'}
          </DialogTitle>
        </DialogHeader>

        {noSpaces ? (
          <p className="text-sm text-muted-foreground py-2">
            No calendar spaces yet. Create a personal or chore space first.
          </p>
        ) : (
          <form
            id="quick-create-form"
            onSubmit={handleSubmit((data) => create.mutate(data))}
            className="flex flex-col gap-4"
          >
            {/* Title */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="qc-title">Title</Label>
              <Input
                id="qc-title"
                placeholder="What needs doing?"
                autoFocus
                autoComplete="off"
                {...register('title')}
              />
              {errors.title && (
                <p className="text-xs text-destructive">{errors.title.message}</p>
              )}
            </div>

            {/* Space picker */}
            <div className="flex flex-col gap-1.5">
              <Label>Space</Label>
              <Select
                value={spaceId}
                onValueChange={(val) => setValue('spaceId', val, { shouldValidate: true })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a space">
                    {selectedSpace ? <SpaceRow space={selectedSpace} /> : null}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {calendarSpaces.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      <SpaceRow space={s} />
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.spaceId && (
                <p className="text-xs text-destructive">{errors.spaceId.message}</p>
              )}
            </div>

            {/* Date picker */}
            <div className="flex flex-col gap-1.5">
              <Label>Date (optional)</Label>
              <div className="flex items-center gap-2">
                <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        'flex-1 justify-start text-left font-normal',
                        !date && 'text-muted-foreground',
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, 'MMM d, yyyy') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <input
                      type="date"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={date ? format(date, 'yyyy-MM-dd') : ''}
                      onChange={(e) => {
                        setValue(
                          'date',
                          e.target.value ? new Date(e.target.value + 'T12:00:00') : undefined,
                        )
                        setDatePickerOpen(false)
                      }}
                    />
                  </PopoverContent>
                </Popover>
                {date && (
                  <button
                    type="button"
                    className="text-xs text-muted-foreground hover:text-foreground"
                    onClick={() => setValue('date', undefined)}
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </form>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="quick-create-form"
            disabled={create.isPending || noSpaces}
          >
            {create.isPending && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
