export { SPACE_COLORS, CHART_COLORS } from '@family/config'

/** Default categories seeded for new families on onboarding.
 *  Users can edit, recolor, reorder, archive, or delete these after creation. */
export const DEFAULT_CATEGORIES = [
  { name: 'Grocery',    color: 'oklch(0.82 0.10 152)', icon: 'ShoppingCart' },
  { name: 'Takeout',    color: 'oklch(0.82 0.10 22)',  icon: 'UtensilsCrossed' },
  { name: 'Shopping',   color: 'oklch(0.82 0.10 308)', icon: 'ShoppingBag' },
  { name: 'Travel',     color: 'oklch(0.82 0.10 228)', icon: 'Plane' },
  { name: 'Utilities',  color: 'oklch(0.84 0.11 88)',  icon: 'Zap' },
  { name: 'Petrol',     color: 'oklch(0.82 0.10 50)',  icon: 'Fuel' },
  { name: 'Car',        color: 'oklch(0.82 0.10 188)', icon: 'Car' },
  { name: 'Gifts',      color: 'oklch(0.82 0.10 345)', icon: 'Gift' },
  { name: 'Misc',       color: 'oklch(0.82 0.05 270)', icon: 'MoreHorizontal' },
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
