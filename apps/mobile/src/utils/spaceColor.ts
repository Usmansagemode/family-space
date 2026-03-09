/**
 * React Native cannot render OKLCH CSS color strings.
 * Space colors are stored as OKLCH in the DB (set from the web app).
 * Maps each SPACE_COLORS entry to sRGB hex equivalents:
 *   base   — pastel fill (card / header background)
 *   accent — vivid deeper tone (checkbox tick, icon tint)
 *   border — mid tone between base and accent (card border)
 */

type SpaceColorTokens = {
  base: string
  accent: string
  border: string
}

const SPACE_COLOR_MAP: Record<string, SpaceColorTokens> = {
  'oklch(0.93 0.06 228)': { base: '#BDD9F2', accent: '#3A7DB5', border: '#9AC4E8' }, // sky blue
  'oklch(0.93 0.06 152)': { base: '#B6ECC8', accent: '#2A9A5C', border: '#88D8A8' }, // mint green
  'oklch(0.95 0.07 88)':  { base: '#F0E89A', accent: '#B08808', border: '#DDD070' }, // butter yellow
  'oklch(0.93 0.06 50)':  { base: '#F4D3AE', accent: '#BE6E24', border: '#E4BE8C' }, // peach
  'oklch(0.93 0.06 308)': { base: '#DEC6EE', accent: '#7644BC', border: '#C6A4E0' }, // lavender
  'oklch(0.93 0.06 345)': { base: '#F4BCCE', accent: '#B63464', border: '#E69AB4' }, // rose
  'oklch(0.93 0.06 188)': { base: '#AEECEA', accent: '#1C8488', border: '#84D8D4' }, // aqua
  'oklch(0.93 0.06 22)':  { base: '#F4C9B6', accent: '#BC3E24', border: '#E6AC94' }, // coral
}

const FALLBACK: SpaceColorTokens = {
  base: '#BDD9F2',
  accent: '#3A7DB5',
  border: '#9AC4E8',
}

export function getSpaceColors(color: string): SpaceColorTokens {
  return SPACE_COLOR_MAP[color] ?? FALLBACK
}

/** Shorthand — just the pastel base hex */
export function resolveSpaceColor(color: string): string {
  return getSpaceColors(color).base
}
