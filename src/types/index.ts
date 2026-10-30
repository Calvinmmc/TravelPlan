export type Transport = 'walk' | 'transit' | 'drive' | 'bike' | 'train' | 'ferry' | 'flight'

export const TRANSPORT_LABELS: Record<Transport, string> = {
  walk: '🚶 步行',
  transit: '🚇 公交/地铁',
  drive: '🚗 驾车/打车',
  bike: '🚲 骑行',
  train: '🚄 火车',
  ferry: '⛴️ 船',
  flight: '✈️ 飞机',
}

/** 在地图上画成虚线的交通方式（跨海、长距离） */
export const DASHED_TRANSPORT: Transport[] = ['flight', 'ferry']

export interface Stop {
  id: string
  name: string
  lng: number
  lat: number
  /** HH:mm */
  time?: string
  /** 从上一站到这里的交通方式（当天第一站 = 从住处/上一天出发） */
  transport?: Transport
  cost?: number
  note?: string
}

export interface Day {
  id: string
  /** YYYY-MM-DD */
  date: string
  title?: string
  stops: Stop[]
}

export interface Trip {
  id: string
  name: string
  /** YYYY-MM-DD */
  startDate: string
  endDate: string
  /** 花费的币种，如 JPY、CNY */
  currency?: string
  /** 来自哪个目的地（research/<slug>），从目的地页添加的行程会带上 */
  destination?: string
  /** 多城市行程途经的所有目的地（按顺序，如 ['fukuoka', 'okinawa']），这些目的地页都会列出这个方案 */
  destinations?: string[]
  days: Day[]
  createdAt: number
  updatedAt: number
}
