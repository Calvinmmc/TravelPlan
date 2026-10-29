/**
 * 目的地调研数据的格式。
 * 由 .claude/agents/travel-*-researcher 生成，存放在 research/<slug>/*.json，
 * scripts/lib/validators.mjs 按这里的定义做校验 —— 修改字段时两边一起改。
 *
 * research/<slug>/
 *   destination.json     Destination
 *   sights.json 等       ResearchFile（各 agent 的原始结果）
 *   research.json        ResearchFile（合并后）
 *   trips/<方案>.json    Trip（src/types/index.ts），一个目的地可以有多个方案
 */

export const CONTINENTS = ['亚洲', '欧洲', '北美洲', '南美洲', '大洋洲', '非洲', '南极洲'] as const
export type Continent = (typeof CONTINENTS)[number]

/**
 * 目的地（城市或地区）的基本信息：research/<slug>/destination.json。
 * 「全部目的地」页按 continent → country → 目的地 分组。
 */
export interface Destination {
  slug: string
  /** 中文名，如 冲绳、清迈 */
  name: string
  /** 当地语言或英文名 */
  localName?: string
  /** 上级行政区，可选，如 冲绳县、清迈府 */
  region?: string
  /** 国家中文名 */
  country: string
  /** ISO 3166-1 两位大写代码，如 JP、TH */
  countryCode: string
  continent: Continent
  /** 中心点，由 scripts/merge-research.mjs 根据调研地点自动计算 */
  lat?: number
  lng?: number
  /** 一句话介绍 */
  summary?: string
}

export type PlaceCategory = 'sight' | 'shopping' | 'lodging' | 'food' | 'transport'

export type Confidence = 'high' | 'medium' | 'low'

export interface Price {
  min?: number
  max?: number
  /** ISO 4217，如 JPY、CNY、THB */
  currency: string
  /** 计价单位：每人、每晚每间、单程、往返、每天… */
  unit?: string
  note?: string
}

export interface ResearchPlace {
  /** 目的地内唯一的英文短横线 id，如 churaumi-aquarium */
  id: string
  category: PlaceCategory
  /** 中文名 */
  name: string
  /** 当地语言或英文名，方便在地图/导航里搜索 */
  localName?: string
  /** 所在区域，如 那霸、北部、宫古岛 */
  area: string
  lat: number
  lng: number
  price?: Price
  hours?: string
  /** 建议停留时长 */
  duration?: string
  tags?: string[]
  tips?: string
  /** 信息来源 URL，至少一个 */
  sources: string[]
  confidence: Confidence
}

export interface CostItem {
  /** 如「冲绳面一碗」「单轨 1 日券」「租车（小型车）」 */
  item: string
  price: Price
  sources: string[]
  confidence: Confidence
}

export type ResearchPart = 'sights' | 'stay-shop' | 'food-cost' | 'merged'

export interface ResearchFile {
  /** 目的地中文名 */
  destination: string
  /** 目录名，如 okinawa */
  slug: string
  part: ResearchPart
  /** 出行月份 YYYY-MM，季节性信息以此为准 */
  travelMonth?: string
  /** 调研日期 YYYY-MM-DD */
  generatedAt: string
  places: ResearchPlace[]
  costs: CostItem[]
  /** 签证、驾照、天气、季节性关闭等要点 */
  notes: string[]
  /** 没能核实、需要出发前再确认的信息 */
  unverified: string[]
}
