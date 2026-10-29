import { useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import { createMap, fitToPoints } from '../../lib/map'

export interface MapPoint {
  id: string
  lng: number
  lat: number
  color: string
  /** 标记里显示的文字：emoji 或简短名称 */
  label: string
  /** 'dot' 圆点（只放 emoji）；'pill' 胶囊（放名称） */
  shape?: 'dot' | 'pill'
  popup: {
    title: string
    subtitle?: string
    lines?: string[]
    link?: { href: string; text: string }
  }
}

interface Props {
  points: MapPoint[]
  selectedId: string | null
  onSelect: (id: string | null) => void
  /** 这个值变化时重新缩放（如切换目的地、切换筛选） */
  fitKey: string
  /** 缩放时要框住的点，默认全部；可以排除出发城市机场这类远点 */
  fitPoints?: { lng: number; lat: number }[]
  maxZoom?: number
}

/** 用 DOM 拼弹窗内容，避免把调研数据当 HTML 插入 */
function popupContent({ title, subtitle, lines, link }: MapPoint['popup']) {
  const root = document.createElement('div')
  root.className = 'place-popup'
  const h = document.createElement('div')
  h.className = 'place-popup-title'
  h.textContent = title
  root.append(h)
  if (subtitle) {
    const s = document.createElement('div')
    s.className = 'place-popup-sub'
    s.textContent = subtitle
    root.append(s)
  }
  for (const line of lines ?? []) {
    const p = document.createElement('div')
    p.textContent = line
    root.append(p)
  }
  if (link) {
    const a = document.createElement('a')
    a.href = link.href
    a.textContent = link.text
    if (/^https?:/.test(link.href)) {
      a.target = '_blank'
      a.rel = 'noopener noreferrer'
    }
    root.append(a)
  }
  return root
}

/** 展示一组地点的地图（目的地总览、目的地调研地点），点击标记选中并弹出详情 */
export default function PlacesMap({ points, selectedId, onSelect, fitKey, fitPoints, maxZoom = 15 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const markersRef = useRef(new Map<string, maplibregl.Marker>())
  const popupRef = useRef<maplibregl.Popup | null>(null)
  const onSelectRef = useRef(onSelect)
  onSelectRef.current = onSelect
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const { map, dispose } = createMap(containerRef.current!)
    map.once('style.load', () => setReady(true))
    map.on('click', () => onSelectRef.current(null))
    mapRef.current = map
    return () => {
      setReady(false)
      dispose()
      mapRef.current = null
    }
  }, [])

  // 标记
  useEffect(() => {
    const map = mapRef.current
    if (!map || !ready) return
    const markers = markersRef.current
    markers.forEach((m) => m.remove())
    markers.clear()
    for (const p of points) {
      const el = document.createElement('div')
      el.className = `place-marker ${p.shape === 'pill' ? 'pill' : 'dot'}`
      el.style.background = p.color
      el.textContent = p.label
      el.title = p.popup.title
      el.addEventListener('click', (ev) => {
        ev.stopPropagation()
        onSelectRef.current(p.id)
      })
      markers.set(p.id, new maplibregl.Marker({ element: el }).setLngLat([p.lng, p.lat]).addTo(map))
    }
  }, [points, ready])

  // 缩放到全部
  useEffect(() => {
    const map = mapRef.current
    if (map && ready) fitToPoints(map, fitPoints ?? points, { maxZoom, singleZoom: Math.min(maxZoom, 10) })
    // 只在 fitKey 变化时缩放，选中、弹窗不触发
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fitKey, ready])

  // 选中：高亮、弹窗、必要时平移
  useEffect(() => {
    const map = mapRef.current
    if (!map || !ready) return
    markersRef.current.forEach((m, id) => m.getElement().classList.toggle('active', id === selectedId))
    popupRef.current?.remove()
    popupRef.current = null
    const p = points.find((x) => x.id === selectedId)
    if (!p) return
    popupRef.current = new maplibregl.Popup({ offset: 16, closeButton: true, closeOnClick: false, maxWidth: '280px' })
      .setLngLat([p.lng, p.lat])
      .setDOMContent(popupContent(p.popup))
      .addTo(map)
    if (!map.getBounds().contains([p.lng, p.lat])) map.easeTo({ center: [p.lng, p.lat] })
  }, [selectedId, points, ready])

  return <div ref={containerRef} className="absolute inset-0" />
}
