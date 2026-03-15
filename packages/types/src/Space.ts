export type SpaceType = 'person' | 'location'

export type Space = {
  id: string
  familyId: string
  name: string
  color: string
  type: SpaceType
  sortOrder: number
  /** Controls visibility in expense pickers.
   *  person + true  → shows in "Paid by" dropdown
   *  location + true → shows in "Location" dropdown
   *  either + false  → board column only (chore area, non-expense location) */
  showInExpenses: boolean
  /** For location spaces: optionally assigned to a person for accountability */
  assignedPersonId: string | null
  deletedAt: Date | null
  createdAt: Date
  updatedAt: Date
}
