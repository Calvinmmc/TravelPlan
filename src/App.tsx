import { useEffect } from 'react'
import { useTripStore, useCurrentTrip } from './store/useTripStore'
import Sidebar from './components/sidebar/Sidebar'
import Itinerary from './components/itinerary/Itinerary'
import MapView from './components/map/MapView'

export default function App() {
  const loaded = useTripStore((s) => s.loaded)
  const load = useTripStore((s) => s.load)
  const trip = useCurrentTrip()

  useEffect(() => {
    load()
  }, [load])

  if (!loaded) return <div className="grid h-full place-items-center text-stone-400">加载中…</div>

  return (
    <div className="flex h-full">
      <Sidebar />
      {trip ? (
        <>
          <Itinerary trip={trip} />
          <main className="relative flex-1">
            <MapView trip={trip} />
          </main>
        </>
      ) : (
        <div className="grid flex-1 place-items-center text-stone-400">新建一个行程开始规划 ✈️</div>
      )}
    </div>
  )
}
