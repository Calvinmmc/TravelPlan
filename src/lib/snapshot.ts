import maplibregl, { type LngLatBoundsLike } from 'maplibre-gl'
import type { Trip } from '../types'
import { dayColor } from './colors'
import { STYLE_URL, addRouteLayers, setRoutes, tripSegments } from './map'

const WIDTH = 640
const HEIGHT = 420

/** 等某个事件，超时返回 false */
const waitFor = (map: maplibregl.Map, event: 'style.load' | 'idle', ms: number) =>
  new Promise<boolean>((resolve) => {
    const timer = setTimeout(() => resolve(false), ms)
    map.once(event, () => {
      clearTimeout(timer)
      resolve(true)
    })
  })

/**
 * 给导出长图用的行程地图截图（JPEG data URL）。
 * 在屏幕外临时建一张不可交互的地图，路线和编号用地图图层画（HTML 标记不会进截图）。
 * 底图样式加载失败时返回 null，由调用方改用 schematicTripMap。
 */
export async function snapshotTripMap(trip: Trip, timeoutMs = 15000): Promise<string | null> {
  const stops = trip.days.flatMap((d) => d.stops)
  if (stops.length === 0) return null

  const container = document.createElement('div')
  Object.assign(container.style, { position: 'fixed', left: '-10000px', top: '0', width: `${WIDTH}px`, height: `${HEIGHT}px` })
  document.body.append(container)

  const map = new maplibregl.Map({
    container,
    style: STYLE_URL,
    interactive: false,
    attributionControl: false,
    preserveDrawingBuffer: true,
    pixelRatio: 2,
    fadeDuration: 0,
  })

  try {
    if (!(await waitFor(map, 'style.load', timeoutMs))) return null

    addRouteLayers(map)
    setRoutes(map, tripSegments(trip.days.map((d, i) => ({ stops: d.stops, color: dayColor(i) }))))
    map.addSource('stops', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: trip.days.flatMap((d, di) =>
          d.stops.map((s, si) => ({
            type: 'Feature' as const,
            properties: { color: dayColor(di), label: String(si + 1) },
            geometry: { type: 'Point' as const, coordinates: [s.lng, s.lat] },
          })),
        ),
      },
    })
    map.addLayer({
      id: 'stops-circle',
      type: 'circle',
      source: 'stops',
      paint: { 'circle-radius': 9, 'circle-color': ['get', 'color'], 'circle-stroke-color': '#fff', 'circle-stroke-width': 2 },
    })
    map.addLayer({
      id: 'stops-label',
      type: 'symbol',
      source: 'stops',
      layout: {
        'text-field': ['get', 'label'],
        'text-font': ['Noto Sans Regular'],
        'text-size': 11,
        'text-allow-overlap': true,
        'text-ignore-placement': true,
      },
      paint: { 'text-color': '#fff' },
    })

    if (stops.length === 1) map.jumpTo({ center: [stops[0].lng, stops[0].lat], zoom: 12 })
    else {
      const bounds = stops.reduce(
        (b, s) => b.extend([s.lng, s.lat]),
        new maplibregl.LngLatBounds([stops[0].lng, stops[0].lat], [stops[0].lng, stops[0].lat]),
      )
      map.fitBounds(bounds as LngLatBoundsLike, { padding: 40, maxZoom: 14, animate: false })
    }

    // 等瓦片下载完。主动 redraw：页面在后台或手机省电时浏览器会暂停动画帧，地图不会自己渲染、也不会去下载瓦片。
    // 网络慢时超时也照样截图（路线和编号已经画好）
    const deadline = Date.now() + timeoutMs
    do {
      map.redraw()
      if (map.loaded() && map.areTilesLoaded()) break
      await new Promise((r) => setTimeout(r, 300))
    } while (Date.now() < deadline)
    map.redraw()

    const canvas = map.getCanvas()
    return isBlank(canvas) ? null : canvas.toDataURL('image/jpeg', 0.85)
  } catch {
    return null
  } finally {
    map.remove()
    container.remove()
  }
}

/** 截图是否是空白（没渲染出来的 WebGL 画布是全黑或全透明） */
function isBlank(canvas: HTMLCanvasElement) {
  const probe = document.createElement('canvas')
  probe.width = probe.height = 16
  const ctx = probe.getContext('2d')
  if (!ctx) return false
  ctx.drawImage(canvas, 0, 0, 16, 16)
  const data = ctx.getImageData(0, 0, 16, 16).data
  for (let i = 0; i < data.length; i += 4) {
    const transparent = data[i + 3] === 0
    const black = data[i] < 8 && data[i + 1] < 8 && data[i + 2] < 8
    if (!transparent && !black) return false
  }
  return true
}

/** 底图加载不了时的简易路线示意图（SVG data URL），不依赖网络 */
export function schematicTripMap(trip: Trip): string | null {
  const stops = trip.days.flatMap((d) => d.stops)
  if (stops.length === 0) return null
  const pad = 30
  const lat0 = stops.reduce((n, s) => n + s.lat, 0) / stops.length
  const k = Math.cos((lat0 * Math.PI) / 180)
  const xs = stops.map((s) => s.lng * k)
  const ys = stops.map((s) => -s.lat)
  const [minX, maxX, minY, maxY] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)]
  const scale = Math.min((WIDTH - 2 * pad) / (maxX - minX || 1), (HEIGHT - 2 * pad) / (maxY - minY || 1))
  const px = (lng: number) => pad + (lng * k - minX) * scale
  const py = (lat: number) => pad + (-lat - minY) * scale

  const parts: string[] = []
  for (const s of tripSegments(trip.days.map((d, i) => ({ stops: d.stops, color: dayColor(i) })))) {
    parts.push(
      `<line x1="${px(s.from[0])}" y1="${py(s.from[1])}" x2="${px(s.to[0])}" y2="${py(s.to[1])}" stroke="${s.color}" stroke-width="3"${s.dashed ? ' stroke-dasharray="8 6"' : ''}/>`,
    )
  }
  trip.days.forEach((d, di) =>
    d.stops.forEach((s, si) => {
      parts.push(
        `<circle cx="${px(s.lng)}" cy="${py(s.lat)}" r="9" fill="${dayColor(di)}" stroke="#fff" stroke-width="2"/>`,
        `<text x="${px(s.lng)}" y="${py(s.lat) + 4}" font-size="11" font-family="sans-serif" fill="#fff" text-anchor="middle">${si + 1}</text>`,
      )
    }),
  )
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}"><rect width="100%" height="100%" fill="#eef2f6"/>${parts.join('')}</svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}
