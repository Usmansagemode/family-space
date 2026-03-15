import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '#/components/ui/dialog'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import type { Category, Space, ExpenseWithNames } from '@family/types'

const schema = z.object({
  date: z.string().min(1, 'Date is required'),
  amount: z.coerce.number().positive('Amount must be positive'),
  description: z.string().optional(),
  categoryId: z.string().optional().nullable(),
  locationId: z.string().optional().nullable(),
  paidById: z.string().optional().nullable(),
})

type FormData = z.infer<typeof schema>

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  expense?: ExpenseWithNames | null
  familyId: string
  categories: Category[]
  locationSpaces: Space[]
  personSpaces: Space[]
  onSave: (data: {
    amount: number
    date: string
    description?: string
    categoryId?: string | null
    locationId?: string | null
    paidById?: string | null
  }) => void
  isSaving?: boolean
}

export function ExpenseDialog({
  open,
  onOpenChange,
  expense,
  categories,
  locationSpaces,
  personSpaces,
  onSave,
  isSaving,
}: Props) {
  const isEditing = !!expense

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { register, handleSubmit, reset, formState } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      date: '',
      amount: undefined,
      description: '',
      categoryId: null,
      locationId: null,
      paidById: null,
    },
  })

  useEffect(() => {
    if (open) {
      if (expense) {
        reset({
          date: expense.date,
          amount: expense.amount,
          description: expense.description ?? '',
          categoryId: expense.categoryId ?? null,
          locationId: expense.locationId ?? null,
          paidById: expense.paidById ?? null,
        })
      } else {
        const today = new Date()
        const yyyy = today.getFullYear()
        const mm = String(today.getMonth() + 1).padStart(2, '0')
        const dd = String(today.getDate()).padStart(2, '0')
        reset({
          date: `${yyyy}-${mm}-${dd}`,
          amount: undefined,
          description: '',
          categoryId: null,
          locationId: null,
          paidById: null,
        })
      }
    }
  }, [open, expense, reset])

  function onSubmit(data: FormData) {
    onSave({
      amount: data.amount,
      date: data.date,
      description: data.description?.trim() || undefined,
      categoryId: data.categoryId || null,
      locationId: data.locationId || null,
      paidById: data.paidById || null,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Expense' : 'Add Expense'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="exp-date">Date</Label>
              <Input
                id="exp-date"
                type="date"
                {...register('date')}
              />
              {formState.errors.date && (
                <p className="text-xs text-destructive">
                  {formState.errors.date.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="exp-amount">Amount</Label>
              <Input
                id="exp-amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                {...register('amount')}
              />
              {formState.errors.amount && (
                <p className="text-xs text-destructive">
                  {formState.errors.amount.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="exp-desc">Description</Label>
            <Input
              id="exp-desc"
              placeholder="What was this for?"
              {...register('description')}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="exp-category">Category</Label>
            <select
              id="exp-category"
              {...register('categoryId')}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">(None)</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="exp-location">Location</Label>
            <select
              id="exp-location"
              {...register('locationId')}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">(None)</option>
              {locationSpaces.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="exp-paidby">Paid by</Label>
            <select
              id="exp-paidby"
              {...register('paidById')}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">(None)</option>
              {personSpaces.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <DialogFooter className="mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? 'Save' : 'Add'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
