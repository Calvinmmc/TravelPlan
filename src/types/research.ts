/**
 * 目的地调研数据的格式。
 * 由 .claude/agents/travel-*-researcher 生成，存放在 research/<slug>/*.json，
 * scripts/validate-research.mjs 按这里的定义做校验 —— 修改字段时两边一起改。
 */

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
