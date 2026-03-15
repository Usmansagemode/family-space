import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { formatCurrency } from '#/lib/utils'
import type { ExpenseWithNames } from '@family/types'

type Props = {
  expenses: ExpenseWithNames[]
  currency?: string
  locale?: string
}

export function ExpenseSummary({ expenses, currency, locale }: Props) {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0)

  // Top 3 categories
  const categoryTotals = new Map<string, { name: string; total: number }>()
  for (const e of expenses) {
    const key = e.categoryId ?? '__none__'
    const name = e.categoryName ?? '(Uncategorized)'
    const existing = categoryTotals.get(key)
    if (existing) {
      existing.total += e.amount
    } else {
      categoryTotals.set(key, { name, total: e.amount })
    }
  }
  const topCategories = [...categoryTotals.values()]
    .sort((a, b) => b.total - a.total)
    .slice(0, 3)

  // By member
  const memberTotals = new Map<string, { name: string; total: number }>()
  for (const e of expenses) {
    const key = e.paidById ?? '__none__'
    const name = e.paidByName ?? '(Unknown member)'
    const existing = memberTotals.get(key)
    if (existing) {
      existing.total += e.amount
    } else {
      memberTotals.set(key, { name, total: e.amount })
    }
  }
  const members = [...memberTotals.values()].sort((a, b) => b.total - a.total)

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Spent
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            {formatCurrency(total, currency, locale)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {expenses.length} expense{expenses.length !== 1 ? 's' : ''}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Top Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          {topCategories.length === 0 ? (
            <p className="text-sm text-muted-foreground">No data</p>
          ) : (
            <ul className="space-y-1">
              {topCategories.map((c) => (
                <li
                  key={c.name}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="truncate text-muted-foreground">
                    {c.name}
                  </span>
                  <span className="ml-2 font-medium">
                    {formatCurrency(c.total, currency, locale)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            By Member
          </CardTitle>
        </CardHeader>
        <CardContent>
          {members.length === 0 ? (
            <p className="text-sm text-muted-foreground">No data</p>
          ) : (
            <ul className="space-y-1">
              {members.map((m) => (
                <li
                  key={m.name}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="truncate text-muted-foreground">
                    {m.name}
                  </span>
                  <span className="ml-2 font-medium">
                    {formatCurrency(m.total, currency, locale)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
