import maplibregl, { type GeoJSONSource, type LngLatBoundsLike } from 'maplibre-gl'
import { DASHED_TRANSPORT, type Stop } from '../types'

// OpenFreeMap：基于 OpenStreetMap 的免费矢量底图，无需 Key
export const STYLE_URL = 'https://tiles.openfreemap.org/styles/liberty'

/** 创建地图：缩放按钮、比例尺、随容器尺寸自适应。返回地图和清理函数 */
export function createMap(container: HTMLElement) {
  const map = new maplibregl.Map({ container, style: STYLE_URL, center: [0, 20], zoom: 1.5 })
  map.addControl(new maplibregl.NavigationControl(), 'top-right')
  map.addControl(new maplibregl.ScaleControl({ unit: 'metric' }), 'bottom-right')

  // 容器尺寸变化（收起侧边栏、切换横竖布局）时重新计算地图大小
  const resizeObserver = new ResizeObserver(() => map.resize())
  resizeObserver.observe(container)

  return {
    map,
    dispose: () => {
      resizeObserver.disconnect()
      map.remove()
    },
  }
}

/** 缩放到能看见所有点；只有一个点时飞过去 */
export function fitToPoints(
  map: maplibregl.Map,
  points: { lng: number; lat: number }[],
  { maxZoom = 15, singleZoom = 14 }: { maxZoom?: number; singleZoom?: number } = {},
) {
  if (points.length === 0) return
  if (points.length === 1) {
    map.flyTo({ center: [points[0].lng, points[0].lat], zoom: singleZoom })
    return
  }
  const bounds = points.reduce(
    (b, p) => b.extend([p.lng, p.lat]),
    new maplibregl.LngLatBounds([points[0].lng, points[0].lat], [points[0].lng, points[0].lat]),
  )
  map.fitBounds(bounds as LngLatBoundsLike, { padding: 80, maxZoom, duration: 800 })
}

// ---------- 路线：每天一种颜色，飞机/船为虚线 ----------

export interface RouteSegment {
  color: string
  dashed: boolean
  from: [number, number]
  to: [number, number]
}

/** 按天把相邻两站连成线段；到达方式是飞机、船的画虚线 */
export function tripSegments(days: { stops: Stop[]; color: string }[]): RouteSegment[] {
  return days.flatMap(({ stops, color }) =>
    stops.slice(1).map((stop, i) => ({
      color,
      dashed: !!stop.transport && DASHED_TRANSPORT.includes(stop.transport),
      from: [stops[i].lng, stops[i].lat] as [number, number],
      to: [stop.lng, stop.lat] as [number, number],
    })),
  )
}

/** 在地图样式加载后调用：添加路线的数据源和图层（白色描边 + 实线 + 虚线） */
export function addRouteLayers(map: maplibregl.Map) {
  map.addSource('routes', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } })
  map.addLayer({
    id: 'routes-casing',
    type: 'line',
    source: 'routes',
    layout: { 'line-join': 'round', 'line-cap': 'round' },
    paint: { 'line-color': '#fff', 'line-width': 7, 'line-opacity': 0.9 },
  })
  map.addLayer({
    id: 'routes-line',
    type: 'line',
    source: 'routes',
    filter: ['!=', ['get', 'dashed'], true],
    layout: { 'line-join': 'round', 'line-cap': 'round' },
    paint: { 'line-color': ['get', 'color'], 'line-width': 4 },
  })
  map.addLayer({
    id: 'routes-dashed',
    type: 'line',
    source: 'routes',
    filter: ['==', ['get', 'dashed'], true],
    layout: { 'line-join': 'round' },
    paint: { 'line-color': ['get', 'color'], 'line-width': 3, 'line-dasharray': [2, 2] },
  })
}

/** 更新路线；路线图层还没加好时返回 false */
export function setRoutes(map: maplibregl.Map, segments: RouteSegment[]) {
  const source = map.getSource('routes') as GeoJSONSource | undefined
  if (!source) return false
  source.setData({
    type: 'FeatureCollection',
    features: segments.map((s) => ({
      type: 'Feature',
      properties: { color: s.color, dashed: s.dashed },
      geometry: { type: 'LineString', coordinates: [s.from, s.to] },
    })),
  })
  return true
}
