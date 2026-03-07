export type Recurrence = 'daily' | 'weekly' | 'monthly' | 'yearly'

export type Item = {
  id: string
  spaceId: string
  title: string
  description?: string
  quantity?: string
  startDate?: Date
  endDate?: Date
  recurrence?: Recurrence
  completed: boolean
  completedAt?: Date
  googleEventId?: string
  sortOrder: number
  createdAt: Date
  updatedAt: Date
}
