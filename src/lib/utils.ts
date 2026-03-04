import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format } from 'date-fns'
import { useState, useEffect } from 'react'

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

// Returns true when the <html> element has the 'dark' class, and updates
// reactively when the user toggles the theme.
export function useIsDark(): boolean {
  const [isDark, setIsDark] = useState(
    () =>
      typeof document !== 'undefined' &&
      document.documentElement.classList.contains('dark'),
  )
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'))
    })
    observer.observe(document.documentElement, { attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])
  return isDark
}
