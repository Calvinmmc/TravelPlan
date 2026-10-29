#!/usr/bin/env node
// 校验 research/<slug>/*.json 是否符合 src/types/research.ts 的 ResearchFile。
// 用法：node scripts/validate-research.mjs <file.json> [...more]
import { readFileSync } from 'node:fs'

const CATEGORIES = ['sight', 'shopping', 'lodging', 'food', 'transport']
const CONFIDENCE = ['high', 'medium', 'low']
const PARTS = ['sights', 'stay-shop', 'food-cost', 'merged']
const ID_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/
/** 离所有地点中位点超过这个距离就提示复查坐标 */
const OUTLIER_KM = 800
/** 同一 area 内：超过 max(这个距离, 区域典型半径 × 系数) 就提示 */
const AREA_MIN_KM = 4
const AREA_SPREAD_FACTOR = 4

const isStr = (v) => typeof v === 'string' && v.trim() !== ''
const isNum = (v) => typeof v === 'number' && Number.isFinite(v)

function distanceKm(a, b) {
  const toRad = (x) => (x * Math.PI) / 180
  const h =
    Math.sin(toRad(b.lat - a.lat) / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(toRad(b.lng - a.lng) / 2) ** 2
  return 2 * 6371 * Math.asin(Math.sqrt(h))
}

const median = (xs) => {
  const s = [...xs].sort((a, b) => a - b)
  return s[Math.floor(s.length / 2)]
}

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

function validate(file) {
  const errors = []
  const warnings = []
  let data
  try {
    data = JSON.parse(readFileSync(file, 'utf8'))
  } catch (e) {
    return { errors: [`无法解析 JSON：${e.message}`], warnings }
  }

  if (!isStr(data.destination)) errors.push('destination 缺失')
  if (!ID_RE.test(data.slug ?? '')) errors.push('slug 必须是英文短横线格式')
  if (!PARTS.includes(data.part)) errors.push(`part 必须是 ${PARTS.join(' / ')}`)
  if (!DATE_RE.test(data.generatedAt ?? '')) errors.push('generatedAt 必须是 YYYY-MM-DD')
  if (data.travelMonth !== undefined && !/^\d{4}-\d{2}$/.test(data.travelMonth)) errors.push('travelMonth 必须是 YYYY-MM')
  const missing = ['places', 'costs', 'notes', 'unverified'].filter((k) => !Array.isArray(data[k]))
  missing.forEach((k) => errors.push(`${k} 必须是数组`))
  if (missing.length) return { errors, warnings }

  const ids = new Set()
  data.places.forEach((p, i) => {
    const where = `places[${i}] ${p.id ?? ''}`
    if (!ID_RE.test(p.id ?? '')) errors.push(`${where}: id 必须是英文短横线格式`)
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

const files = process.argv.slice(2)
if (files.length === 0) {
  console.error('用法：node scripts/validate-research.mjs <file.json> [...more]')
  process.exit(2)
}
let failed = false
for (const file of files) {
  const { errors, warnings } = validate(file)
  console.log(`${errors.length ? '✗' : '✓'} ${file}`)
  errors.forEach((e) => console.log(`  错误：${e}`))
  warnings.forEach((w) => console.log(`  警告：${w}`))
  if (errors.length) failed = true
}
process.exit(failed ? 1 : 0)
