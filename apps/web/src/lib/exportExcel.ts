import * as XLSX from 'xlsx'
import type { ExpenseWithNames } from '@family/types'

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

export function exportToExcel(expenses: ExpenseWithNames[], year: number): void {
  const wb = XLSX.utils.book_new()

  // Sheet 1: All expenses sorted by date
  const sortedExpenses = [...expenses].sort((a, b) => a.date.localeCompare(b.date))
  const expenseRows = sortedExpenses.map((e) => ({
    Date: e.date,
    Description: e.description ?? '',
    Amount: e.amount,
    Category: e.categoryName ?? '(Uncategorized)',
    Location: e.locationName ?? '(Unknown location)',
    'Paid By': e.paidByName ?? '(Unknown member)',
  }))
  const wsExpenses = XLSX.utils.json_to_sheet(expenseRows)
  XLSX.utils.book_append_sheet(wb, wsExpenses, 'Expenses')

  // Sheet 2: Monthly totals
  const monthlyTotals = Array.from({ length: 12 }, (_, i) => {
    const monthNum = i + 1
    const total = expenses
      .filter((e) => parseInt(e.date.slice(5, 7), 10) === monthNum)
      .reduce((sum, e) => sum + e.amount, 0)
    return { Month: MONTH_NAMES[i] ?? '', Total: total }
  })
  const wsMonthly = XLSX.utils.json_to_sheet(monthlyTotals)
  XLSX.utils.book_append_sheet(wb, wsMonthly, 'Monthly Totals')

  // Sheet 3: By category
  const categoryMap = new Map<string, number>()
  for (const e of expenses) {
    const key = e.categoryName ?? '(Uncategorized)'
    categoryMap.set(key, (categoryMap.get(key) ?? 0) + e.amount)
  }
  const categoryRows = [...categoryMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([Category, Total]) => ({ Category, Total }))
  const wsCategory = XLSX.utils.json_to_sheet(categoryRows)
  XLSX.utils.book_append_sheet(wb, wsCategory, 'By Category')

  // Sheet 4: By member
  const memberMap = new Map<string, number>()
  for (const e of expenses) {
    if (!e.paidByName) continue
    memberMap.set(e.paidByName, (memberMap.get(e.paidByName) ?? 0) + e.amount)
  }
  const memberRows = [...memberMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([Member, Total]) => ({ Member, Total }))
  const wsMember = XLSX.utils.json_to_sheet(memberRows)
  XLSX.utils.book_append_sheet(wb, wsMember, 'By Member')

  const filename = `family-expenses-${year}-report.xlsx`
  XLSX.writeFile(wb, filename)
}
