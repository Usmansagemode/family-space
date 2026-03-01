export type Item = {
  id: string
  spaceId: string
  title: string
  description?: string
  startDate?: Date
  endDate?: Date
  completed: boolean
  completedAt?: Date
  googleEventId?: string
  createdAt: Date
  updatedAt: Date
}
