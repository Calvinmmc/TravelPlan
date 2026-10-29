import { create } from 'zustand'
import type { Day, Stop, Trip } from '../types'
import { db } from '../lib/db'
import { uid, withFreshIds } from '../lib/id'
import { dateRange } from '../lib/date'
import { demoTrip } from '../lib/seed'

interface TripState {
  loaded: boolean
  trips: Trip[]
  currentTripId: string | null
  selectedStopId: string | null
  /** 地图只显示某一天；null = 全部 */
  dayFilter: string | null
  /** 正在往哪一天添加地点（点击地图添加） */
  addingToDayId: string | null

  load: () => Promise<void>
  createTrip: (name: string, startDate: string, endDate: string) => void
  deleteTrip: (id: string) => void
  selectTrip: (id: string) => void
  updateTrip: (patch: Partial<Pick<Trip, 'name'>>) => void
  setTripDates: (startDate: string, endDate: string) => void
  updateDay: (dayId: string, patch: Partial<Pick<Day, 'title'>>) => void
  addStop: (dayId: string, stop: Omit<Stop, 'id'>) => string
  updateStop: (stopId: string, patch: Partial<Omit<Stop, 'id'>>) => void
  removeStop: (stopId: string) => void
  moveStop: (stopId: string, delta: -1 | 1) => void
  importTrip: (trip: Trip) => void

  selectStop: (id: string | null) => void
  setDayFilter: (dayId: string | null) => void
  setAddingTo: (dayId: string | null) => void
}

const persist = (trip: Trip) => {
  db.trips.put(trip).catch((e) => console.error('保存失败', e))
}

/** 只加载一次（React StrictMode 下 effect 会跑两次，避免重复写入示例行程） */
let loading: Promise<void> | null = null

const loadTrips = async () => {
  const trips = await db.trips.orderBy('updatedAt').reverse().toArray()
  if (trips.length > 0) return trips
  const demo = demoTrip()
  await db.trips.put(demo)
  return [demo]
}

const buildDays =(startDate: string, endDate: string, existing: Day[] = []): Day[] =>
  dateRange(startDate, endDate).map(
    (date) => existing.find((d) => d.date === date) ?? { id: uid(), date, stops: [] },
  )

export const useTripStore = create<TripState>((set, get) => {
  /** 修改当前行程并持久化 */
  const mutate = (fn: (trip: Trip) => Trip) => {
    const { trips, currentTripId } = get()
    const trip = trips.find((t) => t.id === currentTripId)
    if (!trip) return
    const next = { ...fn(trip), updatedAt: Date.now() }
    set({ trips: trips.map((t) => (t.id === next.id ? next : t)) })
    persist(next)
  }

  const mapStops = (trip: Trip, fn: (stops: Stop[], day: Day) => Stop[]): Trip => ({
    ...trip,
    days: trip.days.map((d) => ({ ...d, stops: fn(d.stops, d) })),
  })

  return {
    loaded: false,
    trips: [],
    currentTripId: null,
    selectedStopId: null,
    dayFilter: null,
    addingToDayId: null,

    load: () => (loading ??= loadTrips().then((trips) => set({ loaded: true, trips, currentTripId: trips[0].id }))),

    createTrip: (name, startDate, endDate) => {
      const now = Date.now()
      const trip: Trip = {
        id: uid(), name, startDate, endDate,
        days: buildDays(startDate, endDate),
        createdAt: now, updatedAt: now,
      }
      set((s) => ({ trips: [trip, ...s.trips], currentTripId: trip.id, selectedStopId: null, dayFilter: null }))
      persist(trip)
    },

    deleteTrip: (id) => {
      const trips = get().trips.filter((t) => t.id !== id)
      set((s) => ({
        trips,
        currentTripId: s.currentTripId === id ? (trips[0]?.id ?? null) : s.currentTripId,
      }))
      db.trips.delete(id)
    },

    selectTrip: (id) =>
      set({ currentTripId: id, selectedStopId: null, dayFilter: null, addingToDayId: null }),

    updateTrip: (patch) => mutate((t) => ({ ...t, ...patch })),

    setTripDates: (startDate, endDate) =>
      mutate((t) => ({ ...t, startDate, endDate, days: buildDays(startDate, endDate, t.days) })),

    updateDay: (dayId, patch) =>
      mutate((t) => ({ ...t, days: t.days.map((d) => (d.id === dayId ? { ...d, ...patch } : d)) })),

    addStop: (dayId, stop) => {
      const id = uid()
      mutate((t) => mapStops(t, (stops, d) => (d.id === dayId ? [...stops, { ...stop, id }] : stops)))
      set({ selectedStopId: id })
      return id
    },

    updateStop: (stopId, patch) =>
      mutate((t) => mapStops(t, (stops) => stops.map((s) => (s.id === stopId ? { ...s, ...patch } : s)))),

    removeStop: (stopId) => {
      mutate((t) => mapStops(t, (stops) => stops.filter((s) => s.id !== stopId)))
      if (get().selectedStopId === stopId) set({ selectedStopId: null })
    },

    moveStop: (stopId, delta) =>
      mutate((t) =>
        mapStops(t, (stops) => {
          const i = stops.findIndex((s) => s.id === stopId)
          const j = i + delta
          if (i < 0 || j < 0 || j >= stops.length) return stops
          const next = [...stops]
          ;[next[i], next[j]] = [next[j], next[i]]
          return next
        }),
      ),

    importTrip: (trip) => {
      // 全部重新生成 id：同一个文件导入两次，或文件里用了 d1-s1 这类简单 id，都不会冲突
      const copy = withFreshIds(trip)
      set((s) => ({ trips: [copy, ...s.trips], currentTripId: copy.id, selectedStopId: null, dayFilter: null }))
      persist(copy)
    },

    selectStop: (id) => set({ selectedStopId: id }),
    setDayFilter: (dayId) => set({ dayFilter: dayId }),
    setAddingTo: (dayId) => set({ addingToDayId: dayId }),
  }
})

export const useCurrentTrip = () =>
  useTripStore((s) => s.trips.find((t) => t.id === s.currentTripId) ?? null)
