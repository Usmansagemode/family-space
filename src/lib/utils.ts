import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return format(date, 'MMM d')
}

export function formatDateFull(date: Date): string {
  return format(date, 'MMM d, yyyy')
}

// Noon (12:00) is the sentinel for "date picked, no explicit time set".
// Any other hour/minute means the user deliberately chose a time.
export function hasExplicitTime(date: Date): boolean {
  return !(date.getHours() === 12 && date.getMinutes() === 0)
}

export function formatTime(date: Date): string {
  return format(date, 'h:mm a') // e.g. "2:30 PM"
}

// Extract the hue component from an oklch(L C H) string
export function extractHue(oklchColor: string): string {
  const match = oklchColor.match(/oklch\([\d.]+\s+[\d.]+\s+([\d.]+)\)/)
  return match?.[1] ?? '0'
}

export type DateStatus = 'overdue' | 'today' | 'soon' | 'future' | null

export function getDateStatus(date: Date): DateStatus {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const dateDay = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const diffDays = Math.round(
    (dateDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  )
  if (diffDays < 0) return 'overdue'
  if (diffDays === 0) return 'today'
  if (diffDays <= 2) return 'soon'
  return 'future'
}
