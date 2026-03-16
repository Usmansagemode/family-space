import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  ArrowDownLeft,
  Briefcase,
  Building2,
  CircleDollarSign,
  Home,
  Loader2,
  Pencil,
  Plus,
  ScanEye,
  Trash2,
  TrendingUp,
  Wallet,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { IncomeType } from '@family/types'
import { useAuthContext } from '#/contexts/auth'
import { useUserFamily } from '#/hooks/auth/useUserFamily'
import { useSpaces } from '#/hooks/spaces/useSpaces'
import { useExpenses } from '#/hooks/expenses/useExpenses'
import { useExpenseMutations } from '#/hooks/expenses/useExpenseMutations'
import { useCategories } from '#/hooks/categories/useCategories'
import { useIncomeEntries } from '#/hooks/income/useIncomeEntries'
import { useIncomeMutations } from '#/hooks/income/useIncomeMutations'
import { MonthYearSelector } from '#/components/expenses/MonthYearSelector'
import { ExpenseSummary } from '#/components/expenses/ExpenseSummary'
import { ExpenseTable } from '#/components/expenses/ExpenseTable'
import { ExpenseDialog } from '#/components/expenses/ExpenseDialog'
import { FocusFillMode } from '#/components/expenses/FocusFillMode'
import { FinancialsChart } from '#/components/expenses/FinancialsChart'
import { Button } from '#/components/ui/button'
import { Skeleton } from '#/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/components/ui/tabs'
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '#/components/ui/sheet'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { cn, formatCurrency } from '#/lib/utils'
import type { ExpenseWithNames, IncomeEntry } from '@family/types'

type IncomeTypeDef = { id: IncomeType; label: string; icon: LucideIcon; hex: string }

const INCOME_TYPES: IncomeTypeDef[] = [
  { id: 'salary',     label: 'Salary',     icon: Briefcase,        hex: '#3b82f6' },
  { id: 'side_gig',  label: 'Side Gig',   icon: CircleDollarSign, hex: '#8b5cf6' },
  { id: 'freelance',  label: 'Freelance',  icon: Briefcase,        hex: '#f97316' },
  { id: 'business',   label: 'Business',   icon: Building2,        hex: '#10b981' },
  { id: 'rental',     label: 'Rental',     icon: Home,             hex: '#f59e0b' },
  { id: 'investment', label: 'Investment', icon: TrendingUp,       hex: '#22c55e' },
  { id: 'other',      label: 'Other',      icon: Wallet,           hex: '#6b7280' },
]

export const Route = createFileRoute('/expenses/')({
  component: ExpensesPage,
})

function ExpensesPage() {
  const { user } = useAuthContext()
  const { data: family } = useUserFamily(user?.id)

  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)

  // expense state
  const [expenseDialogOpen, setExpenseDialogOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<ExpenseWithNames | null>(null)
  const [expenseResetKey, setExpenseResetKey] = useState(0)
  const [focusFillOpen, setFocusFillOpen] = useState(false)

  // income state
  const [incomeDialogOpen, setIncomeDialogOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<IncomeEntry | null>(null)
  const [incomeAmount, setIncomeAmount] = useState('')
  const [incomeDate, setIncomeDate] = useState('')
  const [incomePersonId, setIncomePersonId] = useState<string>('')
  const [incomeType, setIncomeType] = useState<IncomeType | null>(null)
  const [incomeDescription, setIncomeDescription] = useState('')

  const familyId = family?.id ?? ''
  const currency = family?.currency
  const locale = family?.locale

  const prevMonth = month === 1 ? 12 : month - 1
  const prevYear = month === 1 ? year - 1 : year

  const { data: expenses, isLoading: loadingExpenses } = useExpenses(familyId, year, month)
  const { data: prevExpenses } = useExpenses(familyId, prevYear, prevMonth)
  const { data: categories } = useCategories(familyId)
  const { data: spaces } = useSpaces(familyId)
  const expenseMutations = useExpenseMutations(familyId, year, month)

  const prevTotal = (prevExpenses ?? []).reduce((sum, e) => sum + e.amount, 0)

  const { data: incomeEntries, isLoading: loadingIncome } = useIncomeEntries(familyId, year, month)
  const incomeMutations = useIncomeMutations(familyId, year, month)

  const locationSpaces = (spaces ?? []).filter((s) => s.type === 'store' && s.showInExpenses)
  const personSpaces = (spaces ?? []).filter((s) => s.type === 'person' && s.showInExpenses)

  const incomeTotal = (incomeEntries ?? []).reduce((sum, e) => sum + e.amount, 0)

  if (!user) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Please sign in to view your expenses.</p>
      </div>
    )
  }

  // ── Expense handlers ──────────────────────────────────────────────────────

  function handleSaveExpense(data: {
    amount: number
    date: string
    description?: string
    categoryId?: string | null
    locationId?: string | null
    paidById?: string | null
  }) {
    if (editingExpense) {
      expenseMutations.update.mutate(
        { id: editingExpense.id, ...data },
        { onSuccess: () => setExpenseDialogOpen(false) },
      )
    } else {
      expenseMutations.create.mutate(data, { onSuccess: () => setExpenseResetKey((k) => k + 1) })
    }
  }

  function openAddExpense() {
    setEditingExpense(null)
    setExpenseDialogOpen(true)
  }

  function openEditExpense(expense: ExpenseWithNames) {
    setEditingExpense(expense)
    setExpenseDialogOpen(true)
  }

  // ── Income handlers ───────────────────────────────────────────────────────

  function openAddIncome() {
    setEditingEntry(null)
    setIncomeAmount('')
    setIncomeDate(`${year}-${String(month).padStart(2, '0')}-01`)
    setIncomePersonId('')
    setIncomeType(null)
    setIncomeDescription('')
    setIncomeDialogOpen(true)
  }

  function openEditIncome(entry: IncomeEntry) {
    setEditingEntry(entry)
    setIncomeAmount(String(entry.amount))
    setIncomeDate(entry.date)
    setIncomePersonId(entry.personId ?? '')
    setIncomeType(entry.type)
    setIncomeDescription(entry.description ?? '')
    setIncomeDialogOpen(true)
  }

  function handleSaveIncome() {
    const amount = parseFloat(incomeAmount)
    if (isNaN(amount) || amount <= 0 || !incomeDate) return
    const payload = {
      amount,
      date: incomeDate,
      personId: incomePersonId || null,
      type: incomeType,
      description: incomeDescription || undefined,
    }
    if (editingEntry) {
      incomeMutations.update.mutate(
        { id: editingEntry.id, ...payload },
        { onSuccess: () => setIncomeDialogOpen(false) },
      )
    } else {
      incomeMutations.create.mutate(payload, {
        onSuccess: () => {
          setIncomeAmount('')
          setIncomeDate(`${year}-${String(month).padStart(2, '0')}-01`)
          setIncomePersonId('')
          setIncomeType(null)
          setIncomeDescription('')
        },
      })
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex h-full flex-col gap-4 p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-semibold">Finances</h1>
        <MonthYearSelector
          year={year}
          month={month}
          onChange={(y, m) => { setYear(y); setMonth(m) }}
        />
      </div>

      <FinancialsChart
        familyId={familyId}
        year={year}
        currentMonth={month}
        currency={currency}
        locale={locale}
      />

      <Tabs defaultValue="expenses">
        <div className="flex items-center justify-between gap-3">
          <TabsList>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="income">Income</TabsTrigger>
          </TabsList>

          {/* Context-aware add button rendered outside TabsContent to keep it in the header row */}
          <div className="flex gap-2">
            <TabsContent value="expenses" className="mt-0 flex gap-2">
              {(expenses ?? []).length > 0 && (
                <Button variant="outline" onClick={() => setFocusFillOpen(true)}>
                  <ScanEye className="mr-1.5 h-4 w-4" />
                  Quick Tag
                </Button>
              )}
              <Button onClick={openAddExpense}>
                <Plus className="mr-1.5 h-4 w-4" />
                Add expense
              </Button>
            </TabsContent>
            <TabsContent value="income" className="mt-0">
              <Button onClick={openAddIncome}>
                <Plus className="mr-1.5 h-4 w-4" />
                Log income
              </Button>
            </TabsContent>
          </div>
        </div>

        {/* ── Expenses tab ── */}
        <TabsContent value="expenses" className="mt-4 flex flex-col gap-4">
          {loadingExpenses ? (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
              </div>
              <div className="flex flex-col gap-2">
                {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 rounded-lg" />)}
              </div>
            </>
          ) : (
            <>
              <ExpenseSummary
                expenses={expenses ?? []}
                categories={categories ?? []}
                personSpaces={personSpaces}
                prevTotal={prevTotal}
                currency={currency}
                locale={locale}
              />
              <ExpenseTable
                expenses={expenses ?? []}
                categories={categories ?? []}
                locationSpaces={locationSpaces}
                personSpaces={personSpaces}
                familyId={familyId}
                currency={currency}
                locale={locale}
                onEdit={openEditExpense}
                onDelete={(id) => expenseMutations.remove.mutate(id)}
                onDeleteMany={(ids) => expenseMutations.removeMany.mutate(ids)}
                onBulkUpdate={(ids, patch) => expenseMutations.updateMany.mutate({ ids, patch })}
              />
            </>
          )}
        </TabsContent>

        {/* ── Income tab ── */}
        <TabsContent value="income" className="mt-4">
          {loadingIncome ? (
            <div className="flex flex-col gap-2">
              {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 rounded-lg" />)}
            </div>
          ) : (incomeEntries ?? []).length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <ArrowDownLeft className="h-10 w-10 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">No income logged for this month.</p>
              <Button variant="outline" onClick={openAddIncome}>
                <Plus className="mr-1.5 h-4 w-4" />
                Log income
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {/* Summary card */}
              <div className="rounded-xl border bg-card px-5 py-4">
                <p className="text-xs text-muted-foreground">Total income</p>
                <p className="mt-0.5 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(incomeTotal, currency, locale)}
                </p>
              </div>

              {/* Entry list */}
              {(incomeEntries ?? []).map((entry) => {
                const person = personSpaces.find((s) => s.id === entry.personId)
                const typeDef = INCOME_TYPES.find((t) => t.id === entry.type)
                const Icon = typeDef?.icon ?? ArrowDownLeft
                return (
                  <div
                    key={entry.id}
                    className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3"
                  >
                    <div
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                      style={{ background: (typeDef?.hex ?? '#10b981') + '26' }}
                    >
                      <Icon className="h-4 w-4" style={{ color: typeDef?.hex ?? '#10b981' }} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {entry.description || typeDef?.label || 'Income'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {entry.date}
                        {person && <span className="ml-2">· {person.name}</span>}
                      </p>
                    </div>
                    <p className="shrink-0 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(entry.amount, currency, locale)}
                    </p>
                    <button
                      type="button"
                      onClick={() => openEditIncome(entry)}
                      className="shrink-0 text-muted-foreground transition hover:text-foreground"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => incomeMutations.remove.mutate(entry.id)}
                      className="shrink-0 text-muted-foreground transition hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Focus fill mode */}
      <FocusFillMode
        open={focusFillOpen}
        onOpenChange={setFocusFillOpen}
        expenses={expenses ?? []}
        categories={categories ?? []}
        locationSpaces={locationSpaces}
        personSpaces={personSpaces}
        currency={currency}
        locale={locale}
        onSave={(updates) => {
          expenseMutations.updateBatch.mutate(updates, {
            onSuccess: () => setFocusFillOpen(false),
          })
        }}
        isSaving={expenseMutations.updateBatch.isPending}
      />

      {/* Expense dialog */}
      <ExpenseDialog
        open={expenseDialogOpen}
        onOpenChange={setExpenseDialogOpen}
        expense={editingExpense}
        familyId={familyId}
        categories={categories ?? []}
        locationSpaces={locationSpaces}
        personSpaces={personSpaces}
        onSave={handleSaveExpense}
        isSaving={expenseMutations.create.isPending || expenseMutations.update.isPending}
        resetKey={expenseResetKey}
      />

      {/* Income sheet */}
      <Sheet open={incomeDialogOpen} onOpenChange={(open) => {
        setIncomeDialogOpen(open)
        if (!open) setEditingEntry(null)
      }}>
        <SheetContent side="right" className="sm:max-w-md flex flex-col gap-0 p-0">
          <SheetHeader className="border-b px-6 py-4">
            <SheetTitle>{editingEntry ? 'Edit income' : 'Log income'}</SheetTitle>
          </SheetHeader>

          <div className="flex flex-1 flex-col overflow-y-auto">
            <div className="flex flex-col gap-5 px-6 py-5">
              {/* Type chips */}
              <div className="flex flex-col gap-2">
                <Label>Type</Label>
                <div className="flex flex-wrap gap-1.5">
                  {INCOME_TYPES.map((t) => {
                    const Icon = t.icon
                    const selected = incomeType === t.id
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setIncomeType(selected ? null : t.id)}
                        className={cn(
                          'flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-all',
                          selected
                            ? 'shadow-sm'
                            : 'border-border bg-background text-muted-foreground hover:border-border/80 hover:text-foreground',
                        )}
                        style={selected ? {
                          background: `color-mix(in srgb, ${t.hex} 15%, transparent)`,
                          borderColor: `color-mix(in srgb, ${t.hex} 45%, transparent)`,
                          color: 'inherit',
                        } : undefined}
                      >
                        <span
                          className="flex h-4 w-4 shrink-0 items-center justify-center rounded-sm"
                          style={{ background: `color-mix(in srgb, ${t.hex} 20%, transparent)` }}
                        >
                          <Icon className="h-2.5 w-2.5" style={{ color: t.hex }} />
                        </span>
                        {t.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label>Amount</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={incomeAmount}
                    onChange={(e) => setIncomeAmount(e.target.value)}
                    placeholder="0.00"
                    autoFocus
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={incomeDate}
                    onChange={(e) => setIncomeDate(e.target.value)}
                  />
                </div>
              </div>

              {personSpaces.length > 0 && (
                <div className="flex flex-col gap-2">
                  <Label>Person</Label>
                  <div className="flex flex-wrap gap-1.5">
                    {personSpaces.map((p) => {
                      const isSelected = incomePersonId === p.id
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setIncomePersonId(isSelected ? '' : p.id)}
                          className={cn(
                            'flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-all',
                            isSelected
                              ? 'shadow-sm'
                              : 'border-border bg-background text-muted-foreground hover:text-foreground',
                          )}
                          style={isSelected ? {
                            background: `color-mix(in srgb, ${p.color} 15%, transparent)`,
                            borderColor: `color-mix(in srgb, ${p.color} 45%, transparent)`,
                            color: 'inherit',
                          } : undefined}
                        >
                          <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: p.color }} />
                          {p.name}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <Label>
                  Note
                  <span className="ml-1 text-xs text-muted-foreground">(optional)</span>
                </Label>
                <Input
                  value={incomeDescription}
                  onChange={(e) => setIncomeDescription(e.target.value)}
                  placeholder="e.g. March salary, Client X"
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSaveIncome() }}
                />
              </div>
            </div>

            <SheetFooter className="border-t px-6 py-4">
              <Button
                className="w-full"
                onClick={handleSaveIncome}
                disabled={incomeMutations.create.isPending || incomeMutations.update.isPending}
              >
                {(incomeMutations.create.isPending || incomeMutations.update.isPending) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {editingEntry ? 'Save changes' : 'Log income'}
              </Button>
            </SheetFooter>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
