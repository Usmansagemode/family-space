export type FamilyMember = {
  userId: string
  role: 'owner' | 'member'
  name: string | null
  email: string | null
  avatarUrl: string | null
}

export type Family = {
  id: string
  name: string
  googleCalendarId?: string
  googleCalendarEmbedUrl?: string
  createdAt: Date
}
