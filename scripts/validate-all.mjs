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

// 先读所有行程方案：多城市方案会通过 destinations 出现在多个目的地
const plans = slugs.flatMap((slug) => {
  const tripsDir = join(root, slug, 'trips')
  if (!existsSync(tripsDir)) return []
  return readdirSync(tripsDir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => ({ slug, file: join(tripsDir, f), ...readJson(join(tripsDir, f)) }))
})

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
    const covered = plans.some((p) => p.slug === slug || p.data?.destinations?.includes(slug))
    if (!covered) result.errors.push('没有任何行程方案：在 trips/ 下放一个，或在其他目的地的多城市方案的 destinations 里列出它')
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
}

for (const p of plans) {
  const result = p.error ? { errors: [p.error], warnings: [] } : validateTrip(p.data)
  if (p.data) {
    if (p.data.destination !== p.slug) result.errors.push(`destination 应为「${p.slug}」`)
    const listed = p.data.destinations
    if (listed) {
      listed.filter((d) => !slugs.includes(d)).forEach((d) => result.errors.push(`destinations 里的「${d}」不存在`))
      if (!listed.includes(p.slug)) result.errors.push(`destinations 应包含所在目的地「${p.slug}」`)
    }
  }
  failed = report(p.file, result) || failed
}

console.log(`\n${failed ? '✗ 有错误' : '✓ 全部通过'}：${slugs.length} 个目的地，${plans.length} 个行程方案`)
process.exit(failed ? 1 : 0)
