import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  createIncomeSource,
  updateIncomeSource,
  deleteIncomeSource,
  createIncomeEntry,
  deleteIncomeEntry,
} from '@family/supabase'
import type { IncomeType, IncomeFrequency } from '@family/types'

export function useIncomeMutations(familyId: string) {
  const queryClient = useQueryClient()

  const invalidateSources = () =>
    queryClient.invalidateQueries({ queryKey: ['income-sources', familyId] })
  const invalidateEntries = () =>
    queryClient.invalidateQueries({ queryKey: ['income-entries', familyId] })

  const createSource = useMutation({
    mutationFn: (input: {
      personId?: string | null
      name: string
      type: IncomeType
      amount: number
      frequency: IncomeFrequency
      startDate?: string
      endDate?: string
    }) => createIncomeSource({ familyId, ...input }),
    onSuccess: () => { void invalidateSources(); toast.success('Income source added') },
    onError: () => toast.error('Failed to add income source'),
  })

  const updateSource = useMutation({
    mutationFn: ({ id, ...input }: { id: string } & Partial<{
      name: string; type: IncomeType; amount: number
      frequency: IncomeFrequency; startDate: string | null; endDate: string | null
    }>) => updateIncomeSource(id, input),
    onSuccess: () => { void invalidateSources(); toast.success('Income source updated') },
    onError: () => toast.error('Failed to update income source'),
  })

  const removeSource = useMutation({
    mutationFn: (id: string) => deleteIncomeSource(id),
    onSuccess: () => { void invalidateSources(); toast.success('Income source removed') },
    onError: () => toast.error('Failed to remove income source'),
  })

  const logEntry = useMutation({
    mutationFn: (input: {
      incomeSourceId?: string | null
      personId?: string | null
      amount: number
      date: string
      description?: string
    }) => createIncomeEntry({ familyId, ...input }),
    onSuccess: () => { void invalidateEntries(); toast.success('Income logged') },
    onError: () => toast.error('Failed to log income'),
  })

  const removeEntry = useMutation({
    mutationFn: (id: string) => deleteIncomeEntry(id),
    onSuccess: () => { void invalidateEntries(); toast.success('Entry removed') },
    onError: () => toast.error('Failed to remove entry'),
  })

  return { createSource, updateSource, removeSource, logEntry, removeEntry }
}
