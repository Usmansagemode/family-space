export type ActivityEvent = {
  key: string
  type: 'added' | 'completed'
  itemTitle: string
  spaceName: string
  spaceColor: string
  actorName: string | null
  timestamp: Date
}
