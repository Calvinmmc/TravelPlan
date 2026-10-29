import { TRANSPORT_LABELS, type Stop, type Trip } from '../types'
import type { MapPoint } from '../components/map/PlacesMap'
import { dayColor } from './colors'
import { tripSegments } from './map'

export const formatCost = (trip: Trip, cost?: number) =>
  cost === undefined ? '' : `${trip.currency ?? ''} ${cost.toLocaleString()}`.trim()

export const tripTotalCost = (trip: Trip) =>
  trip.days.reduce((n, d) => n + d.stops.reduce((m, s) => m + (s.cost ?? 0), 0), 0)

export const tripStopCount = (trip: Trip) => trip.days.reduce((n, d) => n + d.stops.length, 0)

/** 只读地图用：每站一个带编号的标记 + 按天着色的路线 */
export function tripMapData(trip: Trip) {
  const points: MapPoint[] = trip.days.flatMap((day, di) =>
    day.stops.map((s: Stop, si) => ({
      id: s.id,
      lng: s.lng,
      lat: s.lat,
      color: dayColor(di),
      label: String(si + 1),
      popup: {
        title: s.name,
        subtitle: [`D${di + 1}`, s.time, s.transport && TRANSPORT_LABELS[s.transport]].filter(Boolean).join(' · '),
        lines: [formatCost(trip, s.cost), s.note].filter((x): x is string => !!x),
      },
    })),
  )
  const routes = tripSegments(trip.days.map((d, i) => ({ stops: d.stops, color: dayColor(i) })))
  return { points, routes }
}
