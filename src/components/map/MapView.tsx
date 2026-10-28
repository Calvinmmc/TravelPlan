import { useEffect, useMemo, useRef, useState } from 'react'
import maplibregl, { type GeoJSONSource, type LngLatBoundsLike } from 'maplibre-gl'
import { DASHED_TRANSPORT, type Trip } from '../../types'
import { useTripStore } from '../../store/useTripStore'
import { dayColor } from '../../lib/colors'
import { reverseGeocode } from '../../lib/geocode'

// OpenFreeMap：基于 OpenStreetMap 的免费矢量底图，无需 Key
const STYLE_URL = 'https://tiles.openfreemap.org/styles/liberty'

export default function MapView({ trip }: { trip: Trip }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const markersRef = useRef(new Map<string, maplibregl.Marker>())
  const popupRef = useRef<maplibregl.Popup | null>(null)
  const [ready, setReady] = useState(false)

  const dayFilter = useTripStore((s) => s.dayFilter)
  const setDayFilter = useTripStore((s) => s.setDayFilter)
  const selectedStopId = useTripStore((s) => s.selectedStopId)
  const addingToDayId = useTripStore((s) => s.addingToDayId)
  const setAddingTo = useTripStore((s) => s.setAddingTo)

  const visibleDays = useMemo(
    () =>
      trip.days
        .map((day, index) => ({ day, color: dayColor(index), index }))
        .filter(({ day }) => !dayFilter || day.id === dayFilter),
    [trip.days, dayFilter],
  )

  // 初始化地图（只做一次）
  useEffect(() => {
    const map = new maplibregl.Map({
      container: containerRef.current!,
      style: STYLE_URL,
      center: [0, 20],
      zoom: 1.5,
    })
    map.addControl(new maplibregl.NavigationControl(), 'top-right')
    map.addControl(new maplibregl.ScaleControl({ unit: 'metric' }), 'bottom-right')

    // 样式就绪即可叠加路线和标记，不必等底图瓦片全部下载完（网络慢时 load 事件会很晚）
    map.once('style.load', () => {
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
      // 飞机/船：虚线
      map.addLayer({
        id: 'routes-dashed',
        type: 'line',
        source: 'routes',
        filter: ['==', ['get', 'dashed'], true],
        layout: { 'line-join': 'round' },
        paint: { 'line-color': ['get', 'color'], 'line-width': 3, 'line-dasharray': [2, 2] },
      })
      setReady(true)
    })

    // 添加地点模式下点击地图
    map.on('click', async (e) => {
      const { addingToDayId, addStop, updateStop } = useTripStore.getState()
      if (!addingToDayId) return
      const { lng, lat } = e.lngLat
      const id = addStop(addingToDayId, { name: '', lng, lat })
      const name = await reverseGeocode(lng, lat)
      // 用户还没自己填名字时才自动填
      const current = useTripStore
        .getState()
        .trips.flatMap((t) => t.days.flatMap((d) => d.stops))
        .find((s) => s.id === id)
      if (name && current && !current.name) updateStop(id, { name })
    })

    // 容器尺寸变化（收起侧边栏、切换横竖布局）时重新计算地图大小
    const resizeObserver = new ResizeObserver(() => map.resize())
    resizeObserver.observe(containerRef.current!)

    mapRef.current = map
    return () => {
      resizeObserver.disconnect()
      // 地图被重建（热更新 / StrictMode）时，新地图要等自己的 style.load 才算就绪
      setReady(false)
      map.remove()
      mapRef.current = null
    }
  }, [])

  // 路线 + 标记
  useEffect(() => {
    const map = mapRef.current
    const source = map?.getSource('routes') as GeoJSONSource | undefined
    if (!map || !ready || !source) return

    source.setData({
      type: 'FeatureCollection',
      // 每段单独一条线，按到达方式决定实线/虚线
      features: visibleDays.flatMap(({ day, color }) =>
        day.stops.slice(1).map((stop, i) => {
          const prev = day.stops[i]
          return {
            type: 'Feature' as const,
            properties: { color, dashed: !!stop.transport && DASHED_TRANSPORT.includes(stop.transport) },
            geometry: {
              type: 'LineString' as const,
              coordinates: [
                [prev.lng, prev.lat],
                [stop.lng, stop.lat],
              ],
            },
          }
        }),
      ),
    })

    const markers = markersRef.current
    markers.forEach((m) => m.remove())
    markers.clear()
    for (const { day, color } of visibleDays) {
      day.stops.forEach((stop, i) => {
        const el = document.createElement('div')
        el.className = 'stop-marker'
        el.style.background = color
        el.textContent = String(i + 1)
        el.title = stop.name
        el.addEventListener('click', (ev) => {
          ev.stopPropagation()
          useTripStore.getState().selectStop(stop.id)
        })
        markers.set(stop.id, new maplibregl.Marker({ element: el }).setLngLat([stop.lng, stop.lat]).addTo(map))
      })
    }
    syncSelection()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleDays, ready])

  // 切换行程或筛选某天时，自动缩放到所有地点
  useEffect(() => {
    const map = mapRef.current
    if (!map || !ready) return
    const stops = visibleDays.flatMap(({ day }) => day.stops)
    if (stops.length === 0) return
    if (stops.length === 1) {
      map.flyTo({ center: [stops[0].lng, stops[0].lat], zoom: 14 })
      return
    }
    const bounds = stops.reduce(
      (b, s) => b.extend([s.lng, s.lat]),
      new maplibregl.LngLatBounds([stops[0].lng, stops[0].lat], [stops[0].lng, stops[0].lat]),
    )
    map.fitBounds(bounds as LngLatBoundsLike, { padding: 80, maxZoom: 15, duration: 800 })
    // 只在切换行程/筛选时触发，编辑地点不重新缩放
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trip.id, dayFilter, ready])

  // 选中地点：高亮标记、弹出名称、平移过去
  const syncSelection = () => {
    const map = mapRef.current
    if (!map) return
    markersRef.current.forEach((m, id) => m.getElement().classList.toggle('active', id === selectedStopId))
    popupRef.current?.remove()
    const stop = trip.days.flatMap((d) => d.stops).find((s) => s.id === selectedStopId)
    if (!stop) return
    popupRef.current = new maplibregl.Popup({ offset: 18, closeButton: false, closeOnClick: false })
      .setLngLat([stop.lng, stop.lat])
      .setText(`${stop.time ? stop.time + ' · ' : ''}${stop.name || '未命名地点'}`)
      .addTo(map)
  }

  useEffect(() => {
    syncSelection()
    const map = mapRef.current
    const stop = trip.days.flatMap((d) => d.stops).find((s) => s.id === selectedStopId)
    if (!map || !stop) return
    const inView = map.getBounds().contains([stop.lng, stop.lat])
    if (!inView || map.getZoom() < 12) map.flyTo({ center: [stop.lng, stop.lat], zoom: Math.max(map.getZoom(), 14) })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStopId])

  // 添加模式：十字光标 + Esc 退出
  useEffect(() => {
    const canvas = mapRef.current?.getCanvas()
    if (canvas) canvas.style.cursor = addingToDayId ? 'crosshair' : ''
    if (!addingToDayId) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setAddingTo(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [addingToDayId, setAddingTo])

  const addingDay = trip.days.findIndex((d) => d.id === addingToDayId)

  return (
    <div className="absolute inset-0">
      <div ref={containerRef} className="h-full w-full" />

      {/* 按天筛选 */}
      <div className="absolute left-3 top-3 flex flex-wrap gap-1 rounded-lg bg-white/90 p-1 shadow backdrop-blur">
        <button
          onClick={() => setDayFilter(null)}
          className={`rounded px-2 py-1 text-xs font-medium ${!dayFilter ? 'bg-stone-800 text-white' : 'text-stone-600 hover:bg-stone-100'}`}
        >
          全部
        </button>
        {trip.days.map((day, i) => (
          <button
            key={day.id}
            onClick={() => setDayFilter(day.id)}
            className="rounded px-2 py-1 text-xs font-medium"
            style={
              dayFilter === day.id
                ? { background: dayColor(i), color: '#fff' }
                : { color: dayColor(i) }
            }
          >
            D{i + 1}
          </button>
        ))}
      </div>

      {addingDay >= 0 && (
        <div
          className="absolute bottom-12 left-1/2 -translate-x-1/2 rounded-full px-4 py-2 text-sm text-white shadow-lg"
          style={{ background: dayColor(addingDay) }}
        >
          点击地图为 D{addingDay + 1} 添加地点 · 按 Esc 结束
        </div>
      )}
    </div>
  )
}
