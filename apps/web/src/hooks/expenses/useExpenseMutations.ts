import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  createExpense,
  updateExpense,
  deleteExpense,
  deleteExpenses,
} from '@family/supabase'

export function useExpenseMutations(
  familyId: string,
  year: number,
  month: number,
) {
  const queryClient = useQueryClient()
  const key = ['expenses', familyId, year, month]

  const invalidate = () => queryClient.invalidateQueries({ queryKey: key })

  const create = useMutation({
    mutationFn: (input: {
      amount: number
      date: string
      description?: string
      categoryId?: string | null
      locationId?: string | null
      paidById?: string | null
    }) =>
      createExpense({
        familyId,
        amount: input.amount,
        date: input.date,
        description: input.description,
        categoryId: input.categoryId,
        locationId: input.locationId,
        paidById: input.paidById,
      }),
    onSuccess: () => {
      void invalidate()
      toast.success('Expense added')
    },
    onError: () => {
      toast.error('Failed to add expense')
    },
  })

  const update = useMutation({
    mutationFn: ({
      id,
      ...input
    }: {
      id: string
      amount?: number
      date?: string
      description?: string
      categoryId?: string | null
      locationId?: string | null
      paidById?: string | null
    }) => updateExpense(id, input),
    onSuccess: () => {
      void invalidate()
    },
    onError: () => {
      toast.error('Failed to update expense')
    },
  })

  const remove = useMutation({
    mutationFn: (id: string) => deleteExpense(id),
    onSuccess: () => {
      void invalidate()
      toast.success('Expense deleted')
    },
    onError: () => {
      toast.error('Failed to delete expense')
    },
  })

  const removeMany = useMutation({
    mutationFn: (ids: string[]) => deleteExpenses(ids),
    onSuccess: () => {
      void invalidate()
      toast.success('Expenses deleted')
    },
    onError: () => {
      toast.error('Failed to delete expenses')
    },
  })

  return { create, update, remove, removeMany }
}
