import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { useAuthContext } from '#/contexts/auth'
import { useUserFamily } from '#/hooks/auth/useUserFamily'
import { useSpaces } from '#/hooks/spaces/useSpaces'
import { useExpenses } from '#/hooks/expenses/useExpenses'
import { useExpenseMutations } from '#/hooks/expenses/useExpenseMutations'
import { useCategories } from '#/hooks/categories/useCategories'
import { MonthYearSelector } from '#/components/expenses/MonthYearSelector'
import { ExpenseSummary } from '#/components/expenses/ExpenseSummary'
import { ExpenseTable } from '#/components/expenses/ExpenseTable'
import { ExpenseDialog } from '#/components/expenses/ExpenseDialog'
import { Button } from '#/components/ui/button'
import { Skeleton } from '#/components/ui/skeleton'
import type { ExpenseWithNames } from '@family/types'

export const Route = createFileRoute('/expenses/')({
  component: ExpensesPage,
})

function ExpensesPage() {
  const { user } = useAuthContext()
  const { data: family } = useUserFamily(user?.id)

  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<ExpenseWithNames | null>(
    null,
  )

  const familyId = family?.id ?? ''

  const { data: expenses, isLoading: loadingExpenses } = useExpenses(
    familyId,
    year,
    month,
  )
  const { data: categories } = useCategories(familyId)
  const { data: spaces } = useSpaces(familyId)
  const mutations = useExpenseMutations(familyId, year, month)

  const locationSpaces = (spaces ?? []).filter(
    (s) => s.type === 'store' && s.showInExpenses,
  )
  const personSpaces = (spaces ?? []).filter(
    (s) => s.type === 'person' && s.showInExpenses,
  )

  if (!user) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">
          Please sign in to view your expenses.
        </p>
      </div>
    )
  }

  function handleSave(data: {
    amount: number
    date: string
    description?: string
    categoryId?: string | null
    locationId?: string | null
    paidById?: string | null
  }) {
    if (editingExpense) {
      mutations.update.mutate(
        { id: editingExpense.id, ...data },
        { onSuccess: () => setDialogOpen(false) },
      )
    } else {
      mutations.create.mutate(data, {
        onSuccess: () => setDialogOpen(false),
      })
    }
  }

  function openAddDialog() {
    setEditingExpense(null)
    setDialogOpen(true)
  }

  function openEditDialog(expense: ExpenseWithNames) {
    setEditingExpense(expense)
    setDialogOpen(true)
  }

  return (
    <div className="flex h-full flex-col gap-4 p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-semibold">Expenses</h1>
        <MonthYearSelector
          year={year}
          month={month}
          onChange={(y, m) => {
            setYear(y)
            setMonth(m)
          }}
        />
        <div className="ml-auto">
          <Button onClick={openAddDialog}>
            <Plus className="mr-1.5 h-4 w-4" />
            Add expense
          </Button>
        </div>
      </div>

      {/* Summary */}
      {loadingExpenses ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Skeleton className="h-28 rounded-xl" />
          <Skeleton className="h-28 rounded-xl" />
          <Skeleton className="h-28 rounded-xl" />
        </div>
      ) : (
        <ExpenseSummary
          expenses={expenses ?? []}
          currency={family?.currency}
          locale={family?.locale}
        />
      )}

      {/* Table */}
      {loadingExpenses ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 rounded-lg" />
          ))}
        </div>
      ) : (
        <ExpenseTable
          expenses={expenses ?? []}
          categories={categories ?? []}
          locationSpaces={locationSpaces}
          personSpaces={personSpaces}
          familyId={familyId}
          currency={family?.currency}
          locale={family?.locale}
          onEdit={openEditDialog}
          onDelete={(id) => mutations.remove.mutate(id)}
          onDeleteMany={(ids) => mutations.removeMany.mutate(ids)}
        />
      )}

      {/* Dialog */}
      <ExpenseDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        expense={editingExpense}
        familyId={familyId}
        categories={categories ?? []}
        locationSpaces={locationSpaces}
        personSpaces={personSpaces}
        onSave={handleSave}
        isSaving={
          mutations.create.isPending || mutations.update.isPending
        }
      />
    </div>
  )
}
