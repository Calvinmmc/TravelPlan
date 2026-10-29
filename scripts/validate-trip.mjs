#!/usr/bin/env node
// 校验 trip.json 是否符合 src/types/index.ts 的 Trip，能被 app 的「导入」正常读取。
// 用法：node scripts/validate-trip.mjs <trip.json>
import { readFileSync } from 'node:fs'

const TRANSPORT = ['walk', 'transit', 'drive', 'bike', 'train', 'ferry', 'flight']
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/

const isStr = (v) => typeof v === 'string' && v.trim() !== ''
const isNum = (v) => typeof v === 'number' && Number.isFinite(v)

const addDay = (date, n) => {
  const d = new Date(`${date}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
}

function distanceKm(a, b) {
  const toRad = (x) => (x * Math.PI) / 180
  const h =
    Math.sin(toRad(b.lat - a.lat) / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(toRad(b.lng - a.lng) / 2) ** 2
  return 2 * 6371 * Math.asin(Math.sqrt(h))
}

const toMin = (t) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3))

function validate(trip) {
  const errors = []
  const warnings = []
  if (!isStr(trip.name)) errors.push('name 缺失')
  if (!DATE_RE.test(trip.startDate ?? '') || !DATE_RE.test(trip.endDate ?? '')) errors.push('startDate / endDate 必须是 YYYY-MM-DD')
  if (trip.currency !== undefined && !/^[A-Z]{3}$/.test(trip.currency)) errors.push('currency 必须是 3 位大写货币代码')
  if (!Array.isArray(trip.days) || trip.days.length === 0) errors.push('days 必须是非空数组')
  if (errors.length) return { errors, warnings }

  const ids = new Set()
  const unique = (id, where) => {
    if (!isStr(id)) errors.push(`${where}: id 缺失`)
    else if (ids.has(id)) errors.push(`${where}: id 重复 ${id}`)
    ids.add(id)
  }

  trip.days.forEach((day, di) => {
    const dw = `D${di + 1}`
    unique(day.id, dw)
    const expected = addDay(trip.startDate, di)
    if (day.date !== expected) errors.push(`${dw}: date 应为 ${expected}，实际 ${day.date}`)
    if (!Array.isArray(day.stops)) return errors.push(`${dw}: stops 必须是数组`)
    if (day.stops.length === 0) warnings.push(`${dw}: 没有安排地点`)

    day.stops.forEach((s, si) => {
      const w = `${dw}-${si + 1} ${s.name ?? ''}`
      unique(s.id, w)
      if (!isStr(s.name)) errors.push(`${w}: name 缺失`)
      if (!isNum(s.lat) || Math.abs(s.lat) > 90 || !isNum(s.lng) || Math.abs(s.lng) > 180) errors.push(`${w}: 坐标无效`)
      if (s.time !== undefined && !TIME_RE.test(s.time)) errors.push(`${w}: time 必须是 HH:mm`)
      if (s.transport !== undefined && !TRANSPORT.includes(s.transport)) errors.push(`${w}: transport 必须是 ${TRANSPORT.join(' / ')}`)
      if (s.cost !== undefined && (!isNum(s.cost) || s.cost < 0)) errors.push(`${w}: cost 必须是非负数`)

      const prev = day.stops[si - 1]
      if (!prev) return
      if (prev.time && s.time && toMin(s.time) < toMin(prev.time)) warnings.push(`${w}: 时间早于上一站`)
      if (isNum(prev.lat) && isNum(s.lat)) {
        const km = distanceKm(prev, s)
        if (km > 80 && !['flight', 'ferry', 'train'].includes(s.transport)) {
          warnings.push(`${w}: 距上一站 ${Math.round(km)} km，交通方式却是 ${s.transport ?? '未填'}`)
        }
      }
    })
  })

  const expectedEnd = addDay(trip.startDate, trip.days.length - 1)
  if (trip.endDate !== expectedEnd) errors.push(`endDate 应为 ${expectedEnd}（与 days 数量一致）`)
  return { errors, warnings }
}

const file = process.argv[2]
if (!file) {
  console.error('用法：node scripts/validate-trip.mjs <trip.json>')
  process.exit(2)
}
let trip
try {
  trip = JSON.parse(readFileSync(file, 'utf8'))
} catch (e) {
  console.log(`✗ ${file}\n  错误：无法解析 JSON：${e.message}`)
  process.exit(1)
}
const { errors, warnings } = validate(trip)
const stops = Array.isArray(trip.days) ? trip.days.reduce((n, d) => n + (d.stops?.length ?? 0), 0) : 0
console.log(`${errors.length ? '✗' : '✓'} ${file}（${trip.days?.length ?? 0} 天，${stops} 个地点）`)
errors.forEach((e) => console.log(`  错误：${e}`))
warnings.forEach((w) => console.log(`  警告：${w}`))
process.exit(errors.length ? 1 : 0)
