import { useEffect, useMemo, useState } from 'react'
import type { Trip } from '../../types'
import { decodeTrip } from '../../lib/share'
import { getDestination } from '../../lib/destinations'
import { navigate, routeHref } from '../../lib/router'
import { tripMapData } from '../../lib/tripView'
import { useTripStore } from '../../store/useTripStore'
import PlacesMap from '../map/PlacesMap'
import MapErrorBoundary from '../map/MapErrorBoundary'
import TripDocument from './TripDocument'
import ExportDialog from './ExportDialog'

/** 打开别人发来的分享链接：只读查看，可以保存到自己的行程 */
export default function SharedTripView({ payload }: { payload: string }) {
  const [trip, setTrip] = useState<Trip | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setTrip(null)
    setError(null)
    decodeTrip(payload)
      .then(setTrip)
      .catch((e: Error) => setError(e.message || '链接不完整或已损坏'))
  }, [payload])

  if (error) {
    return (
      <div className="grid flex-1 place-items-center px-6 text-center text-stone-500">
        <div>
          <p className="text-lg">😕 打不开这个分享链接</p>
          <p className="mt-1 text-sm text-stone-400">{error}。可能是链接复制不完整，请让对方重新发一次，或改发长图。</p>
          <a href={routeHref({ name: 'trips' })} className="mt-3 inline-block text-sm underline">
            去我的行程
          </a>
        </div>
      </div>
    )
  }
  if (!trip) return <div className="grid flex-1 place-items-center text-stone-400">正在打开行程…</div>
  return <SharedTrip trip={trip} />
}

function SharedTrip({ trip }: { trip: Trip }) {
  const importTrip = useTripStore((s) => s.importTrip)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [exporting, setExporting] = useState(false)
  const { points, routes } = useMemo(() => tripMapData(trip), [trip])
  const dest = trip.destination ? getDestination(trip.destination) : undefined

  const save = () => {
    importTrip(trip)
    navigate({ name: 'trips' })
  }

  return (
    <div className="flex min-w-0 flex-1 flex-col-reverse md:flex-row">
      <section className="flex h-[55%] min-h-0 shrink-0 flex-col border-t border-stone-200 bg-white md:h-auto md:w-[clamp(300px,40vw,440px)] md:border-r md:border-t-0">
        <div className="border-b border-amber-100 bg-amber-50 px-4 py-3 md:px-6">
          <p className="text-sm text-stone-600">📩 这是别人分享给你的行程（只读）</p>
          <div className="mt-2 flex gap-2">
            <button onClick={save} className="flex-1 rounded-md bg-stone-800 py-1.5 text-sm text-white hover:bg-stone-700">
              ＋ 保存到我的行程
            </button>
            <button onClick={() => setExporting(true)} className="rounded-md border border-stone-300 bg-white px-3 py-1.5 text-sm hover:bg-stone-50">
              导出长图
            </button>
          </div>
          {dest && (
            <a href={routeHref({ name: 'destination', slug: dest.slug })} className="mt-2 inline-block text-xs text-stone-500 underline">
              查看「{dest.name}」的调研资料和更多方案 ›
            </a>
          )}
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-4 md:px-6">
          <TripDocument trip={trip} selectedStopId={selectedId} onStopClick={setSelectedId} />
        </div>
      </section>

      <main className="relative min-h-0 min-w-0 flex-1">
        <MapErrorBoundary>
          <PlacesMap points={points} routes={routes} selectedId={selectedId} onSelect={setSelectedId} fitKey={trip.id} />
        </MapErrorBoundary>
      </main>

      {exporting && <ExportDialog trip={trip} onClose={() => setExporting(false)} />}
    </div>
  )
}
