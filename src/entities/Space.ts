export type SpaceType = 'person' | 'store'

export type Space = {
  id: string
  familyId: string
  name: string
  color: string
  type: SpaceType
  sortOrder: number
  createdAt: Date
}
