import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export {
  formatDate,
  formatDateFull,
  hasExplicitTime,
  formatTime,
  extractHue,
  getDateStatus,
} from '@family/utils'
export type { DateStatus } from '@family/utils'
