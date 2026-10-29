import type { Trip } from '../types'

/** 仓库里所有 /plan-trip 生成的行程（research/<slug>/trip.json），构建时打包进网页 */
const modules = import.meta.glob<Trip>('../../research/*/trip.json', { eager: true, import: 'default' })

export const libraryTrips = Object.entries(modules)
  .map(([path, trip]) => ({ slug: path.split('/').slice(-2)[0], trip }))
  .sort((a, b) => a.trip.startDate.localeCompare(b.trip.startDate))
