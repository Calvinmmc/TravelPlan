import type { PlaceCategory, Price, ResearchPlace } from '../types/research'

export const CATEGORY_META: Record<PlaceCategory, { label: string; emoji: string; color: string }> = {
  sight: { label: '景点', emoji: '🏛️', color: '#e4572e' },
  food: { label: '餐厅', emoji: '🍜', color: '#f18f01' },
  shopping: { label: '购物', emoji: '🛍️', color: '#a23b72' },
  lodging: { label: '住宿', emoji: '🏨', color: '#2e86ab' },
  transport: { label: '交通', emoji: '🚉', color: '#57534e' },
}

export const CATEGORY_ORDER = Object.keys(CATEGORY_META) as PlaceCategory[]

/** { min: 1000, max: 2000, currency: 'JPY', unit: '每人' } → 'JPY 1,000–2,000 / 每人' */
export function formatPrice(p?: Price) {
  if (!p) return ''
  const { min, max, currency, unit } = p
  let amount = ''
  if (min !== undefined && max !== undefined && min !== max) amount = `${min.toLocaleString()}–${max.toLocaleString()}`
  else if (min !== undefined || max !== undefined) amount = (min ?? max)!.toLocaleString()
  if (amount === '0') return '免费'
  return [amount && `${currency} ${amount}`, unit].filter(Boolean).join(' / ')
}

export const placeSubtitle = (p: ResearchPlace) =>
  [CATEGORY_META[p.category].label, p.area, p.localName].filter(Boolean).join(' · ')
