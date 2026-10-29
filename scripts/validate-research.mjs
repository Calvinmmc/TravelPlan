#!/usr/bin/env node
// 校验调研数据文件（ResearchFile）。
// 用法：node scripts/validate-research.mjs <file.json> [...more]
import { readJson, report, validateResearch } from './lib/validators.mjs'

const files = process.argv.slice(2)
if (files.length === 0) {
  console.error('用法：node scripts/validate-research.mjs <file.json> [...more]')
  process.exit(2)
}
let failed = false
for (const file of files) {
  const { data, error } = readJson(file)
  const result = error ? { errors: [error], warnings: [] } : validateResearch(data)
  if (report(file, result)) failed = true
}
process.exit(failed ? 1 : 0)
