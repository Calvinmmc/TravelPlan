import { useEffect } from 'react'
import { useTripStore, useCurrentTrip } from './store/useTripStore'
import { useRoute } from './lib/router'
import Sidebar from './components/sidebar/Sidebar'
import Itinerary from './components/itinerary/Itinerary'
import MapView from './components/map/MapView'
import MapErrorBoundary from './components/map/MapErrorBoundary'
import ExploreView from './components/explore/ExploreView'
import DestinationView from './components/explore/DestinationView'
import SharedTripView from './components/share/SharedTripView'

export default function App() {
  const loaded = useTripStore((s) => s.loaded)
  const load = useTripStore((s) => s.load)
  const trip = useCurrentTrip()
  const route = useRoute()

  useEffect(() => {
    load()
  }, [load])

  if (!loaded) return <div className="grid h-full place-items-center text-stone-400">加载中…</div>

  return (
    <div className="flex h-full">
      <Sidebar route={route} />
      {route.name === 'shared' ? (
        <SharedTripView payload={route.payload} />
      ) : route.name === 'explore' ? (
        <ExploreView />
      ) : route.name === 'destination' ? (
        <DestinationView slug={route.slug} />
      ) : trip ? (
        // 宽屏左右分栏；窄屏（<768px）地图在上、列表在下
        <div className="flex min-w-0 flex-1 flex-col-reverse md:flex-row">
          <Itinerary trip={trip} />
          <main className="relative min-h-0 min-w-0 flex-1">
            <MapErrorBoundary>
              <MapView trip={trip} />
            </MapErrorBoundary>
          </main>
        </div>
      ) : (
        <div className="grid flex-1 place-items-center text-stone-400">新建一个行程开始规划 ✈️</div>
      )}
    </div>
  )
}
