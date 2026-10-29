import { useMemo, useState } from 'react'
import { flagEmoji, getCountry, type CountryEntry } from '../../lib/destinations'
import { routeHref } from '../../lib/router'
import PlacesMap from '../map/PlacesMap'
import MapErrorBoundary from '../map/MapErrorBoundary'
import { DestinationCard, StatTile, destinationPoints } from './parts'

export default function CountryView({ code }: { code: string }) {
  const country = getCountry(code)
  if (!country) {
    return (
      <div className="grid flex-1 place-items-center text-center text-stone-400">
        <div>
          <p>还没有「{code}」的目的地</p>
          <a href={routeHref({ name: 'home' })} className="mt-2 inline-block text-sm text-stone-600 underline">
            回到首页
          </a>
        </div>
      </div>
    )
  }
  return <CountryDetail key={code} country={country} />
}

/** 国家页：该国所有目的地的卡片 + 地图 */
function CountryDetail({ country }: { country: CountryEntry }) {
  const [hovered, setHovered] = useState<string | null>(null)
  const points = useMemo(() => destinationPoints(country.destinations), [country])

  return (
    <div className="flex min-w-0 flex-1 flex-col-reverse md:flex-row">
      <section className="flex h-[60%] min-h-0 shrink-0 flex-col border-t border-stone-200 bg-stone-50 md:h-auto md:w-[clamp(320px,42vw,480px)] md:border-r md:border-t-0">
        <div className="flex-1 overflow-y-auto px-4 py-4 md:px-6 md:py-6">
          <nav className="text-xs text-stone-400">
            <a href={routeHref({ name: 'home' })} className="hover:text-stone-600">
              首页
            </a>
            {' › '}
            {country.continent}
          </nav>

          <header className="mt-3 flex items-center gap-4">
            <span className="text-5xl leading-none">{flagEmoji(country.code)}</span>
            <div>
              <h1 className="text-2xl font-bold text-stone-900">{country.name}</h1>
              <p className="text-sm text-stone-400">{country.continent}</p>
            </div>
          </header>

          <div className="mt-5 grid grid-cols-3 gap-2">
            <StatTile label="目的地" value={country.destinations.length} />
            <StatTile label="行程方案" value={country.planCount} />
            <StatTile label="调研地点" value={country.placeCount} />
          </div>

          <h2 className="mb-3 mt-6 text-sm font-semibold text-stone-600">目的地</h2>
          <div className="space-y-3">
            {country.destinations.map((d) => (
              <DestinationCard key={d.slug} dest={d} onHover={setHovered} />
            ))}
          </div>
        </div>
      </section>

      <main className="relative min-h-0 min-w-0 flex-1">
        <MapErrorBoundary>
          <PlacesMap points={points} selectedId={hovered} onSelect={setHovered} fitKey={country.code} maxZoom={8} />
        </MapErrorBoundary>
      </main>
    </div>
  )
}
