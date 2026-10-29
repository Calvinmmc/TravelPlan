#!/usr/bin/env node
// 校验行程文件（Trip），确保能被网页的「导入」正常读取。
// 用法：node scripts/validate-trip.mjs <trip.json> [...more]
import { readJson, report, validateTrip } from './lib/validators.mjs'

const files = process.argv.slice(2)
if (files.length === 0) {
  console.error('用法：node scripts/validate-trip.mjs <trip.json> [...more]')
  process.exit(2)
}
let failed = false
for (const file of files) {
  const { data, error } = readJson(file)
  const result = error ? { errors: [error], warnings: [] } : validateTrip(data)
  const stops = data?.days?.reduce?.((n, d) => n + (d.stops?.length ?? 0), 0) ?? 0
  if (report(`${file}（${data?.days?.length ?? 0} 天，${stops} 个地点）`, result)) failed = true
}
process.exit(failed ? 1 : 0)
