#!/usr/bin/env node
// 校验 research/ 下所有目的地：destination.json、research.json、trips/*.json，以及它们之间是否一致。
// 部署前（GitHub Actions）和 /plan-trip 结束时运行。
// 用法：node scripts/validate-all.mjs [research 目录，默认 research]
import { existsSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { readJson, report, validateDestination, validateResearch, validateTrip } from './lib/validators.mjs'

const root = process.argv[2] ?? 'research'
const slugs = readdirSync(root).filter((name) => statSync(join(root, name)).isDirectory())
let failed = false
let tripCount = 0

for (const slug of slugs) {
  const dir = join(root, slug)

  // destination.json：必需，slug 要和目录名一致
  const destFile = join(dir, 'destination.json')
  if (!existsSync(destFile)) {
    failed = report(destFile, { errors: ['缺少 destination.json（目的地的国家、大洲等信息）'], warnings: [] }) || failed
  } else {
    const { data, error } = readJson(destFile)
    const result = error ? { errors: [error], warnings: [] } : validateDestination(data)
    if (data && data.slug !== slug) result.errors.push(`slug「${data.slug}」与目录名「${slug}」不一致`)
    failed = report(destFile, result) || failed
  }

  // research.json：有就校验（只放了行程、没做调研的目的地也允许）
  const researchFile = join(dir, 'research.json')
  if (existsSync(researchFile)) {
    const { data, error } = readJson(researchFile)
    const result = error ? { errors: [error], warnings: [] } : validateResearch(data)
    if (data && data.slug !== slug) result.errors.push(`slug「${data.slug}」与目录名「${slug}」不一致`)
    // 合并后的数据太多警告，这里只看错误；警告在各 agent 产出时已经处理过
    failed = report(researchFile, { errors: result.errors, warnings: [] }) || failed
  }

  // trips/*.json：至少一个方案
  const tripsDir = join(dir, 'trips')
  const tripFiles = existsSync(tripsDir) ? readdirSync(tripsDir).filter((f) => f.endsWith('.json')) : []
  if (tripFiles.length === 0) {
    failed = report(tripsDir, { errors: ['至少要有一个行程方案 trips/<方案>.json'], warnings: [] }) || failed
  }
  for (const f of tripFiles) {
    const file = join(tripsDir, f)
    const { data, error } = readJson(file)
    const result = error ? { errors: [error], warnings: [] } : validateTrip(data)
    if (data && data.destination !== slug) result.errors.push(`destination 应为「${slug}」`)
    failed = report(file, result) || failed
    tripCount++
  }
}

console.log(`\n${failed ? '✗ 有错误' : '✓ 全部通过'}：${slugs.length} 个目的地，${tripCount} 个行程方案`)
process.exit(failed ? 1 : 0)
