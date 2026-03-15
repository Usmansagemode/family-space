export { initSupabase, getSupabaseClient } from './client'

export {
  fetchSpaces,
  fetchExpensePickerSpaces,
  createSpace,
  updateSpace,
  archiveSpace,
  deleteSpace,
  countSpaceExpenses,
  reorderSpaces,
} from './spaces'

export {
  fetchCategories,
  fetchAllCategories,
  createCategory,
  updateCategory,
  countCategoryExpenses,
  archiveCategory,
  deleteCategory,
  reassignAndDeleteCategory,
  reorderCategories,
} from './categories'

export {
  fetchExpensesByMonth,
  fetchExpensesByYear,
  createExpense,
  updateExpense,
  deleteExpense,
  deleteExpenses,
} from './expenses'

export {
  fetchIncomeSources,
  createIncomeSource,
  updateIncomeSource,
  deleteIncomeSource,
  fetchIncomeEntries,
  createIncomeEntry,
  deleteIncomeEntry,
} from './income'

export { fetchBudgets, upsertBudget, deleteBudget } from './budgets'

export {
  fetchTrackers,
  createTracker,
  updateTracker,
  deleteTracker,
  fetchTrackerEntries,
  addTrackerEntry,
  deleteTrackerEntry,
} from './trackers'

export {
  fetchItems,
  createItem,
  updateItem,
  completeItem,
  deleteItem,
  moveItem,
  searchItems,
  reorderItems,
  advanceRecurringItem,
  reAddItem,
} from './items'

export {
  fetchFamily,
  updateFamily,
  findFamily,
  fetchFamilyMembers,
  removeFamilyMember,
  findOrCreateFamily,
} from './families'

export { fetchRecentActivity } from './activity'
export type { RawActivityItem } from './activity'

export { createInvite, getInviteByToken, acceptInvite } from './invites'
export type { InviteInfo } from './invites'
