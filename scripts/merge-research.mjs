#!/usr/bin/env node
// 合并 research/<slug>/ 下各 agent 的调研文件，生成 research.json（part: merged）和 README.md 一览表。
// 用法：node scripts/merge-research.mjs research/<slug>
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { median } from './lib/validators.mjs'

const PARTS = ['sights', 'stay-shop', 'food-cost']
const CATEGORY_LABELS = { sight: '景点', transport: '交通节点', lodging: '住宿', shopping: '购物', food: '餐厅' }
const RANK = { high: 3, medium: 2, low: 1 }

const dir = process.argv[2]
if (!dir) {
  console.error('用法：node scripts/merge-research.mjs research/<slug>')
  process.exit(2)
}

const files = PARTS.map((p) => join(dir, `${p}.json`)).filter(existsSync)
if (files.length === 0) {
  console.error(`${dir} 下没有 ${PARTS.map((p) => p + '.json').join(' / ')}`)
  process.exit(1)
}
const parts = files.map((f) => JSON.parse(readFileSync(f, 'utf8')))
const first = parts[0]

// 同 id 的地点保留可信度更高的一条，来源合并
const places = new Map()
for (const p of parts.flatMap((x) => x.places)) {
  const existing = places.get(p.id)
  if (!existing) places.set(p.id, p)
  else {
    const keep = RANK[p.confidence] > RANK[existing.confidence] ? p : existing
    places.set(p.id, { ...keep, sources: [...new Set([...existing.sources, ...p.sources])] })
  }
}

const uniq = (xs) => [...new Set(xs)]
const merged = {
  destination: first.destination,
  slug: first.slug,
  part: 'merged',
  travelMonth: parts.find((x) => x.travelMonth)?.travelMonth,
  generatedAt: parts.map((x) => x.generatedAt).sort().at(-1),
  places: [...places.values()],
  costs: parts.flatMap((x) => x.costs),
  notes: uniq(parts.flatMap((x) => x.notes)),
  unverified: uniq(parts.flatMap((x) => x.unverified)),
}
writeFileSync(join(dir, 'research.json'), JSON.stringify(merged, null, 2) + '\n')

// 目的地中心点：取非交通类地点坐标的中位数（避开出发城市机场这类远点），写回 destination.json
const destFile = join(dir, 'destination.json')
if (existsSync(destFile)) {
  const dest = JSON.parse(readFileSync(destFile, 'utf8'))
  const pts = merged.places.filter((p) => p.category !== 'transport')
  if (pts.length) {
    dest.lat = Number(median(pts.map((p) => p.lat)).toFixed(4))
    dest.lng = Number(median(pts.map((p) => p.lng)).toFixed(4))
    writeFileSync(destFile, JSON.stringify(dest, null, 2) + '\n')
    console.log(`✓ 更新 ${destFile} 中心点 ${dest.lat}, ${dest.lng}`)
  }
} else {
  console.log(`！${destFile} 不存在，请按 src/types/research.ts 的 Destination 创建`)
}

// ---- README.md ----
const fmtPrice = (p) => {
  if (!p) return ''
  const range = p.min === undefined && p.max === undefined
    ? ''
    : p.min === p.max || p.max === undefined
      ? `${(p.min ?? p.max).toLocaleString()}`
      : `${(p.min ?? 0).toLocaleString()}–${p.max.toLocaleString()}`
  return [range && `${p.currency} ${range}`, p.unit, p.note].filter(Boolean).join(' · ')
}
const cell = (s) => String(s ?? '').replace(/\|/g, '／').replace(/\n/g, ' ')
const link = (urls) => urls.map((u, i) => `[${i + 1}](${u})`).join(' ')

const lines = [
  `# ${merged.destination} 调研`,
  '',
  `调研日期 ${merged.generatedAt}${merged.travelMonth ? `，出行月份 ${merged.travelMonth}` : ''}。` +
    `共 ${merged.places.length} 个地点、${merged.costs.length} 项价格。价格为调研时的参考值，出发前请以官网为准。`,
  '',
  '> 本文件由 `scripts/merge-research.mjs` 生成，请勿手改；数据在 `research.json`。',
  '',
]

if (merged.notes.length) lines.push('## 要点', '', ...merged.notes.map((n) => `- ${n}`), '')

for (const [cat, label] of Object.entries(CATEGORY_LABELS)) {
  const items = merged.places.filter((p) => p.category === cat)
  if (!items.length) continue
  lines.push(`## ${label}（${items.length}）`, '', '| 名称 | 区域 | 价格 | 时间 | 标签 | 提示 | 来源 |', '|---|---|---|---|---|---|---|')
  for (const p of items.sort((a, b) => a.area.localeCompare(b.area, 'zh'))) {
    const name = p.localName ? `${p.name}<br><sub>${p.localName}</sub>` : p.name
    const time = [p.hours, p.duration && `建议 ${p.duration}`].filter(Boolean).join('<br>')
    const flag = p.confidence === 'low' ? ' ⚠️' : ''
    lines.push(`| ${cell(name)}${flag} | ${cell(p.area)} | ${cell(fmtPrice(p.price))} | ${cell(time)} | ${cell((p.tags ?? []).join('、'))} | ${cell(p.tips)} | ${link(p.sources)} |`)
  }
  lines.push('')
}

if (merged.costs.length) {
  lines.push('## 消费参考', '', '| 项目 | 价格 | 来源 |', '|---|---|---|')
  for (const c of merged.costs) lines.push(`| ${cell(c.item)}${c.confidence === 'low' ? ' ⚠️' : ''} | ${cell(fmtPrice(c.price))} | ${link(c.sources)} |`)
  lines.push('')
}

if (merged.unverified.length) lines.push('## 待核实', '', ...merged.unverified.map((u) => `- ${u}`), '')
lines.push('⚠️ = 可信度低，出发前务必再确认。', '')

writeFileSync(join(dir, 'README.md'), lines.join('\n'))
console.log(`✓ 合并 ${files.length} 个文件 → ${join(dir, 'research.json')}（${merged.places.length} 个地点，${merged.costs.length} 项价格）`)
console.log(`✓ 生成 ${join(dir, 'README.md')}`)
