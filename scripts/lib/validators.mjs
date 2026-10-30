// 调研数据、目的地信息、行程的校验逻辑。字段定义见 src/types/research.ts 和 src/types/index.ts，改字段时两边一起改。
// 每个 validateXxx 返回 { errors: string[], warnings: string[] }。
import { readFileSync } from 'node:fs'

const CATEGORIES = ['sight', 'shopping', 'lodging', 'food', 'transport']
const CONFIDENCE = ['high', 'medium', 'low']
const PARTS = ['sights', 'stay-shop', 'food-cost', 'merged']
const CONTINENTS = ['亚洲', '欧洲', '北美洲', '南美洲', '大洋洲', '非洲', '南极洲']
const TRANSPORT = ['walk', 'transit', 'drive', 'bike', 'train', 'ferry', 'flight']
export const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/
/** 离所有地点中位点超过这个距离就提示复查坐标 */
const OUTLIER_KM = 800
/** 同一 area 内：超过 max(这个距离, 区域典型半径 × 系数) 就提示 */
const AREA_MIN_KM = 4
const AREA_SPREAD_FACTOR = 4

const isStr = (v) => typeof v === 'string' && v.trim() !== ''
const isNum = (v) => typeof v === 'number' && Number.isFinite(v)

export function distanceKm(a, b) {
  const toRad = (x) => (x * Math.PI) / 180
  const h =
    Math.sin(toRad(b.lat - a.lat) / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(toRad(b.lng - a.lng) / 2) ** 2
  return 2 * 6371 * Math.asin(Math.sqrt(h))
}

export const median = (xs) => {
  const s = [...xs].sort((a, b) => a - b)
  return s[Math.floor(s.length / 2)]
}

/** 读 JSON 文件；解析失败时返回 { error } */
export function readJson(file) {
  try {
    return { data: JSON.parse(readFileSync(file, 'utf8')) }
  } catch (e) {
    return { error: `无法读取或解析 JSON：${e.message}` }
  }
}

/** 打印一个文件的校验结果，返回是否有错误 */
export function report(label, { errors, warnings }) {
  console.log(`${errors.length ? '✗' : '✓'} ${label}`)
  errors.forEach((e) => console.log(`  错误：${e}`))
  warnings.forEach((w) => console.log(`  警告：${w}`))
  return errors.length > 0
}

// ---------- 调研数据 ResearchFile ----------

function checkPrice(p, where, errors) {
  if (typeof p !== 'object' || p === null) return errors.push(`${where}: price 必须是对象`)
  if (!/^[A-Z]{3}$/.test(p.currency ?? '')) errors.push(`${where}: price.currency 必须是 3 位大写货币代码`)
  for (const k of ['min', 'max']) {
    if (p[k] !== undefined && (!isNum(p[k]) || p[k] < 0)) errors.push(`${where}: price.${k} 必须是非负数`)
  }
  if (isNum(p.min) && isNum(p.max) && p.min > p.max) errors.push(`${where}: price.min > price.max`)
}

function checkSources(s, where, errors) {
  if (!Array.isArray(s) || s.length === 0) return errors.push(`${where}: sources 至少要有一个 URL`)
  s.forEach((u) => /^https?:\/\//.test(u) || errors.push(`${where}: 无效的来源 URL ${u}`))
}

export function validateResearch(data) {
  const errors = []
  const warnings = []

  if (!isStr(data.destination)) errors.push('destination 缺失')
  if (!SLUG_RE.test(data.slug ?? '')) errors.push('slug 必须是英文短横线格式')
  if (!PARTS.includes(data.part)) errors.push(`part 必须是 ${PARTS.join(' / ')}`)
  if (!DATE_RE.test(data.generatedAt ?? '')) errors.push('generatedAt 必须是 YYYY-MM-DD')
  if (data.travelMonth !== undefined && !/^\d{4}-\d{2}$/.test(data.travelMonth)) errors.push('travelMonth 必须是 YYYY-MM')
  const missing = ['places', 'costs', 'notes', 'unverified'].filter((k) => !Array.isArray(data[k]))
  missing.forEach((k) => errors.push(`${k} 必须是数组`))
  if (missing.length) return { errors, warnings }

  const ids = new Set()
  data.places.forEach((p, i) => {
    const where = `places[${i}] ${p.id ?? ''}`
    if (!SLUG_RE.test(p.id ?? '')) errors.push(`${where}: id 必须是英文短横线格式`)
    else if (ids.has(p.id)) errors.push(`${where}: id 重复`)
    ids.add(p.id)
    if (!CATEGORIES.includes(p.category)) errors.push(`${where}: category 必须是 ${CATEGORIES.join(' / ')}`)
    if (!isStr(p.name)) errors.push(`${where}: name 缺失`)
    if (!isStr(p.area)) errors.push(`${where}: area 缺失`)
    if (!isNum(p.lat) || Math.abs(p.lat) > 90) errors.push(`${where}: lat 无效`)
    if (!isNum(p.lng) || Math.abs(p.lng) > 180) errors.push(`${where}: lng 无效`)
    if (!CONFIDENCE.includes(p.confidence)) errors.push(`${where}: confidence 必须是 high / medium / low`)
    if (p.price !== undefined) checkPrice(p.price, where, errors)
    checkSources(p.sources, where, errors)
  })

  data.costs.forEach((c, i) => {
    const where = `costs[${i}] ${c.item ?? ''}`
    if (!isStr(c.item)) errors.push(`${where}: item 缺失`)
    checkPrice(c.price, where, errors)
    if (!CONFIDENCE.includes(c.confidence)) errors.push(`${where}: confidence 必须是 high / medium / low`)
    checkSources(c.sources, where, errors)
  })

  // 坐标离群检查（只提示，不算错误：出发城市的机场之类可能合理地很远）
  const located = data.places.filter((p) => isNum(p.lat) && isNum(p.lng))
  if (located.length >= 3) {
    const center = { lat: median(located.map((p) => p.lat)), lng: median(located.map((p) => p.lng)) }
    for (const p of located) {
      const d = distanceKm(center, p)
      if (d > OUTLIER_KM) warnings.push(`${p.id}: 距其他地点中心约 ${Math.round(d)} km，请复查坐标`)
    }
  }
  // 同一 area 内的离群点：常见于手抄坐标漏了一位数字（如 26.2145 写成 26.1453）
  const byArea = Map.groupBy(located, (p) => p.area)
  for (const [area, ps] of byArea) {
    if (ps.length < 4) continue // 点太少时「典型半径」不稳定，容易误报
    const c = { lat: median(ps.map((p) => p.lat)), lng: median(ps.map((p) => p.lng)) }
    const spread = median(ps.map((p) => distanceKm(c, p)))
    const limit = Math.max(AREA_MIN_KM, AREA_SPREAD_FACTOR * spread)
    for (const p of ps) {
      const d = distanceKm(c, p)
      if (d > limit) warnings.push(`${p.id}: 离「${area}」其他地点约 ${d.toFixed(1)} km，可能坐标有误`)
    }
  }

  const dupCoords = new Map()
  for (const p of located) {
    const key = `${p.lat.toFixed(4)},${p.lng.toFixed(4)}`
    if (dupCoords.has(key)) warnings.push(`${p.id} 与 ${dupCoords.get(key)} 坐标完全相同，确认是否估计值`)
    else dupCoords.set(key, p.id)
  }

  return { errors, warnings }
}

// ---------- 目的地 Destination ----------

export function validateDestination(d) {
  const errors = []
  const warnings = []
  if (!SLUG_RE.test(d.slug ?? '')) errors.push('slug 必须是英文短横线格式')
  if (!isStr(d.name)) errors.push('name 缺失')
  if (!isStr(d.country)) errors.push('country 缺失')
  if (!/^[A-Z]{2}$/.test(d.countryCode ?? '')) errors.push('countryCode 必须是 ISO 3166-1 两位大写代码，如 JP')
  if (!CONTINENTS.includes(d.continent)) errors.push(`continent 必须是 ${CONTINENTS.join(' / ')}`)
  const hasLat = d.lat !== undefined
  const hasLng = d.lng !== undefined
  if (hasLat !== hasLng) errors.push('lat 和 lng 要么都有，要么都没有')
  if (hasLat && (!isNum(d.lat) || Math.abs(d.lat) > 90)) errors.push('lat 无效')
  if (hasLng && (!isNum(d.lng) || Math.abs(d.lng) > 180)) errors.push('lng 无效')
  if (!hasLat) warnings.push('还没有中心点坐标，运行 merge-research 会自动补上')
  if (d.stats !== undefined) {
    const s = d.stats
    if (!DATE_RE.test(s?.researchedAt ?? '')) errors.push('stats.researchedAt 必须是 YYYY-MM-DD')
    if (!isNum(s?.places) || s.places < 0) errors.push('stats.places 必须是非负数')
    const cats = Object.entries(s?.byCategory ?? {})
    if (cats.some(([k, v]) => !CATEGORIES.includes(k) || !isNum(v) || v < 0)) errors.push('stats.byCategory 的类别或数量无效')
  }
  return { errors, warnings }
}

// ---------- 行程 Trip ----------

const addDay = (date, n) => {
  const d = new Date(`${date}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
}

const toMin = (t) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3))

export function validateTrip(trip) {
  const errors = []
  const warnings = []
  if (!isStr(trip.name)) errors.push('name 缺失')
  if (!DATE_RE.test(trip.startDate ?? '') || !DATE_RE.test(trip.endDate ?? '')) errors.push('startDate / endDate 必须是 YYYY-MM-DD')
  if (trip.currency !== undefined && !/^[A-Z]{3}$/.test(trip.currency)) errors.push('currency 必须是 3 位大写货币代码')
  if (trip.destination !== undefined && !SLUG_RE.test(trip.destination)) errors.push('destination 必须是目的地 slug')
  if (trip.destinations !== undefined && (!Array.isArray(trip.destinations) || !trip.destinations.every((d) => SLUG_RE.test(d)))) {
    errors.push('destinations 必须是目的地 slug 数组')
  }
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
