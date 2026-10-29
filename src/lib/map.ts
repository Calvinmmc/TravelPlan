import maplibregl, { type LngLatBoundsLike } from 'maplibre-gl'

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
