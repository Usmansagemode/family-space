import { getYearOptions } from '#/lib/utils'

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

type Props = {
  year: number
  month: number // 1-based
  onChange: (year: number, month: number) => void
}

export function MonthYearSelector({ year, month, onChange }: Props) {
  const years = getYearOptions()

  return (
    <div className="flex items-center gap-2">
      <select
        value={month}
        onChange={(e) => onChange(year, Number(e.target.value))}
        className="rounded-md border border-input bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      >
        {MONTHS.map((name, i) => (
          <option key={i + 1} value={i + 1}>
            {name}
          </option>
        ))}
      </select>
      <select
        value={year}
        onChange={(e) => onChange(Number(e.target.value), month)}
        className="rounded-md border border-input bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      >
        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    </div>
  )
}
