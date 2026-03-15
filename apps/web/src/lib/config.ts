export { SPACE_COLORS } from '@family/config'

/** Default categories seeded for new families on onboarding.
 *  Users can edit, recolor, reorder, archive, or delete these after creation. */
export const DEFAULT_CATEGORIES = [
  { name: 'Grocery',    color: 'oklch(0.70 0.15 145)', icon: 'ShoppingCart' },
  { name: 'Takeout',    color: 'oklch(0.70 0.18 30)',  icon: 'UtensilsCrossed' },
  { name: 'Shopping',   color: 'oklch(0.68 0.18 290)', icon: 'ShoppingBag' },
  { name: 'Travel',     color: 'oklch(0.72 0.17 220)', icon: 'Plane' },
  { name: 'Utilities',  color: 'oklch(0.68 0.14 60)',  icon: 'Zap' },
  { name: 'Petrol',     color: 'oklch(0.65 0.16 25)',  icon: 'Fuel' },
  { name: 'Car',        color: 'oklch(0.65 0.14 200)', icon: 'Car' },
  { name: 'Gifts',      color: 'oklch(0.70 0.18 350)', icon: 'Gift' },
  { name: 'Misc',       color: 'oklch(0.60 0.05 270)', icon: 'MoreHorizontal' },
] as const

/** Pro-only features — check family plan before rendering or running these. */
export const PRO_FEATURES = [
  'yearly-charts',
  'per-member-charts',
  'pdf-import',
  'excel-export',
  'trackers',
  'google-calendar',
] as const

export type ProFeature = (typeof PRO_FEATURES)[number]
