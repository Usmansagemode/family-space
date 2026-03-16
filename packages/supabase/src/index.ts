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
  unarchiveCategory,
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
  fetchIncomeEntries,
  createIncomeEntry,
  updateIncomeEntry,
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

export {
  fetchRecurringTransactions,
  createRecurringTransaction,
  updateRecurringTransaction,
  deleteRecurringTransaction,
} from './recurringTransactions'

export { logActivity, fetchActivityLog } from './activity'
export type { RawActivityLog } from './activity'

export { createInvite, getInviteByToken, acceptInvite } from './invites'
export type { InviteInfo } from './invites'

export {
  fetchSplitGroups,
  fetchSplitGroup,
  createSplitGroup,
  updateSplitGroup,
  deleteSplitGroup,
  fetchSplitParticipants,
  createSplitParticipant,
  deleteSplitParticipant,
  fetchSplitExpenses,
  createSplitExpense,
  updateSplitExpense,
  deleteSplitExpense,
  fetchSplitSettlements,
  createSplitSettlement,
  deleteSplitSettlement,
} from './splits'
