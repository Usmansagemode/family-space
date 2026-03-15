export type Recurrence = 'daily' | 'weekly' | 'monthly' | 'yearly'

export type Item = {
  id: string
  spaceId: string
  familyId?: string
  title: string
  description?: string
  quantity?: string
  recurrence?: Recurrence
  sortOrder: number
  startDate?: Date
  endDate?: Date
  completed: boolean
  completedAt?: Date
  completedBy?: string
  createdBy?: string
  googleEventId?: string
  createdAt: Date
  updatedAt: Date
}
