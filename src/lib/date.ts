const WEEKDAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

function parse(date: string) {
  const [y, m, d] = date.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d))
}

export function today() {
  const d = new Date()
  return toISO(new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())))
}

function toISO(d: Date) {
  return d.toISOString().slice(0, 10)
}

export function addDays(date: string, n: number) {
  const d = parse(date)
  d.setUTCDate(d.getUTCDate() + n)
  return toISO(d)
}

/** start..end 的所有日期（含首尾），最多 60 天 */
export function dateRange(start: string, end: string) {
  const out: string[] = []
  let cur = start
  while (cur <= end && out.length < 60) {
    out.push(cur)
    cur = addDays(cur, 1)
  }
  return out
}

export function formatDay(date: string) {
  const d = parse(date)
  return `${d.getUTCMonth() + 1}/${d.getUTCDate()} ${WEEKDAYS[d.getUTCDay()]}`
}
