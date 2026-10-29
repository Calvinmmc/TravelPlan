import type { Stop, Transport, Trip } from '../types'
import { addDays } from './date'
import { uid } from './id'
import { routeHref } from './router'

/**
 * 分享链接：把行程压缩后放进链接本身（#/s/<payload>），不需要服务器。
 * payload = 'z' + base64url(deflate(紧凑 JSON))；浏览器不支持压缩时用 'j' + base64url(JSON)。
 * 紧凑 JSON：[版本, 名称, 开始日期, 币种, 目的地, [[当天主题, [[名称, 纬度, 经度, 时间, 交通, 花费, 备注], …]], …]]
 */
const VERSION = 1

/** 超过这个长度的链接，在微信里可能被截断或打不开 */
export const LONG_LINK_CHARS = 4000

type CompactStop = [string, number, number, string, string, number | '', string]
type CompactTrip = [number, string, string, string, string, [string, CompactStop[]][]]

const round = (n: number) => Math.round(n * 1e5) / 1e5

function toCompact(trip: Trip, includeNotes: boolean): CompactTrip {
  return [
    VERSION,
    trip.name,
    trip.startDate,
    trip.currency ?? '',
    trip.destination ?? '',
    trip.days.map((d) => [
      d.title ?? '',
      d.stops.map((s): CompactStop => [
        s.name,
        round(s.lat),
        round(s.lng),
        s.time ?? '',
        s.transport ?? '',
        s.cost ?? '',
        includeNotes ? (s.note ?? '') : '',
      ]),
    ]),
  ]
}

function fromCompact(c: CompactTrip): Trip {
  const [version, name, startDate, currency, destination, days] = c
  if (version !== VERSION || !Array.isArray(days)) throw new Error('不支持的分享链接版本')
  const now = Date.now()
  return {
    id: uid(),
    name,
    startDate,
    endDate: addDays(startDate, Math.max(days.length - 1, 0)),
    currency: currency || undefined,
    destination: destination || undefined,
    createdAt: now,
    updatedAt: now,
    days: days.map(([title, stops], i) => ({
      id: uid(),
      date: addDays(startDate, i),
      title: title || undefined,
      stops: stops.map(([n, lat, lng, time, transport, cost, note]): Stop => ({
        id: uid(),
        name: n,
        lat,
        lng,
        time: time || undefined,
        transport: (transport || undefined) as Transport | undefined,
        cost: cost === '' ? undefined : cost,
        note: note || undefined,
      })),
    })),
  }
}

const toBase64Url = (bytes: Uint8Array) => {
  let bin = ''
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

const fromBase64Url = (s: string) => {
  const bin = atob(s.replace(/-/g, '+').replace(/_/g, '/'))
  return Uint8Array.from(bin, (c) => c.charCodeAt(0))
}

async function pipe(bytes: Uint8Array, stream: CompressionStream | DecompressionStream) {
  const out = new Blob([bytes as Uint8Array<ArrayBuffer>]).stream().pipeThrough(stream)
  return new Uint8Array(await new Response(out).arrayBuffer())
}

export async function encodeTrip(trip: Trip, includeNotes = true): Promise<string> {
  const json = new TextEncoder().encode(JSON.stringify(toCompact(trip, includeNotes)))
  if (typeof CompressionStream === 'undefined') return 'j' + toBase64Url(json)
  return 'z' + toBase64Url(await pipe(json, new CompressionStream('deflate-raw')))
}

export async function decodeTrip(payload: string): Promise<Trip> {
  const kind = payload[0]
  let bytes = fromBase64Url(payload.slice(1))
  if (kind === 'z') {
    if (typeof DecompressionStream === 'undefined') throw new Error('浏览器版本太旧，打不开这个分享链接，请换用最新的浏览器')
    bytes = await pipe(bytes, new DecompressionStream('deflate-raw'))
  } else if (kind !== 'j') {
    throw new Error('链接格式不对')
  }
  return fromCompact(JSON.parse(new TextDecoder().decode(bytes)))
}

/** 完整的分享网址（基于当前站点地址，本地开发和线上都对） */
export async function shareUrl(trip: Trip, includeNotes = true) {
  const payload = await encodeTrip(trip, includeNotes)
  const base = window.location.href.split('#')[0]
  return base + routeHref({ name: 'shared', payload })
}
