import type { Trip } from '../types'
import { CONTINENTS, type Continent, type Destination, type ResearchFile } from '../types/research'

/**
 * 仓库 research/ 下的目的地，构建时打包进网页：
 * destination.json 和 trips/*.json 体积小，直接打包；research.json 较大，进入目的地页时再按需加载。
 */
const destModules = import.meta.glob<Destination>('../../research/*/destination.json', { eager: true, import: 'default' })
const tripModules = import.meta.glob<Trip>('../../research/*/trips/*.json', { eager: true, import: 'default' })
const researchLoaders = import.meta.glob<ResearchFile>('../../research/*/research.json', { import: 'default' })

/** '../../research/okinawa/trips/5d.json' → ['okinawa', '5d'] */
const pathParts = (path: string) => path.replace('../../research/', '').replace(/\.json$/, '').split('/')

export interface DestinationPlan {
  /** trips/ 下的文件名（不含 .json），在目的地内唯一 */
  key: string
  trip: Trip
}

export interface DestinationEntry extends Destination {
  plans: DestinationPlan[]
  hasResearch: boolean
}

export const destinations: DestinationEntry[] = Object.values(destModules)
  .map((d) => ({
    ...d,
    plans: Object.entries(tripModules)
      .filter(([path]) => pathParts(path)[0] === d.slug)
      .map(([path, trip]) => ({ key: pathParts(path)[2], trip }))
      .sort((a, b) => a.trip.days.length - b.trip.days.length),
    hasResearch: `../../research/${d.slug}/research.json` in researchLoaders,
  }))
  .sort((a, b) => a.name.localeCompare(b.name, 'zh'))

export const getDestination = (slug: string) => destinations.find((d) => d.slug === slug)

export async function loadResearch(slug: string): Promise<ResearchFile | null> {
  const load = researchLoaders[`../../research/${slug}/research.json`]
  return load ? load() : null
}

/** JP → 🇯🇵 */
export const flagEmoji = (countryCode: string) =>
  String.fromCodePoint(...[...countryCode.toUpperCase()].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65))

export interface CountryGroup {
  country: string
  countryCode: string
  destinations: DestinationEntry[]
}

export interface ContinentGroup {
  continent: Continent
  countries: CountryGroup[]
}

/** 按 大洲 → 国家 → 目的地 分组；大洲按固定顺序，国家和目的地按名称 */
export function groupDestinations(list: DestinationEntry[]): ContinentGroup[] {
  return CONTINENTS.map((continent) => {
    const inContinent = list.filter((d) => d.continent === continent)
    const countries = [...new Set(inContinent.map((d) => d.countryCode))]
      .map((code) => {
        const ds = inContinent.filter((d) => d.countryCode === code)
        return { country: ds[0].country, countryCode: code, destinations: ds }
      })
      .sort((a, b) => a.country.localeCompare(b.country, 'zh'))
    return { continent, countries }
  }).filter((g) => g.countries.length > 0)
}

/** 搜索：目的地中文名、当地名、地区、国家、大洲 */
export const matchDestination = (d: DestinationEntry, q: string) => {
  const s = q.trim().toLowerCase()
  return !s || [d.name, d.localName, d.region, d.country, d.continent, d.slug].some((v) => v?.toLowerCase().includes(s))
}
