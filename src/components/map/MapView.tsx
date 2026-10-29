import { useEffect, useMemo, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import type { Trip } from '../../types'
import { useTripStore } from '../../store/useTripStore'
import { dayColor } from '../../lib/colors'
import { reverseGeocode } from '../../lib/geocode'
import { addRouteLayers, createMap, fitToPoints, setRoutes, tripSegments } from '../../lib/map'

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
    const { map, dispose } = createMap(containerRef.current!)

    // 样式就绪即可叠加路线和标记，不必等底图瓦片全部下载完（网络慢时 load 事件会很晚）
    map.once('style.load', () => {
      addRouteLayers(map)
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

    mapRef.current = map
    return () => {
      // 地图被重建（热更新 / StrictMode）时，新地图要等自己的 style.load 才算就绪
      setReady(false)
      dispose()
      mapRef.current = null
    }
  }, [])

  // 路线 + 标记
  useEffect(() => {
    const map = mapRef.current
    if (!map || !ready || !setRoutes(map, tripSegments(visibleDays.map(({ day, color }) => ({ stops: day.stops, color }))))) return

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
    fitToPoints(map, visibleDays.flatMap(({ day }) => day.stops))
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
