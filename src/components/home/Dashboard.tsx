import { useMemo, useState } from 'react'
import type { Continent } from '../../types/research'
import { continentSummary, countries, destinations, flagEmoji, totals, type CountryEntry } from '../../lib/destinations'
import { formatDay } from '../../lib/date'
import { navigate, routeHref } from '../../lib/router'
import { tripStopCount } from '../../lib/tripView'
import { useTripStore } from '../../store/useTripStore'
import { REPO_URL } from '../../config'
import PlacesMap from '../map/PlacesMap'
import MapErrorBoundary from '../map/MapErrorBoundary'
import { SectionTitle, StatTile, destinationPoints } from './parts'

/** 首页：统计、世界地图、按大洲分组的国家卡片、我的行程 */
export default function Dashboard() {
  const [continent, setContinent] = useState<Continent | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)

  const shownCountries = countries.filter((c) => !continent || c.continent === continent)
  const shownDestinations = destinations.filter((d) => !continent || d.continent === continent)
  const points = useMemo(() => destinationPoints(shownDestinations), [continent]) // eslint-disable-line react-hooks/exhaustive-deps
  const continentsWithData = continentSummary.filter((c) => c.destinations > 0)

  return (
    <div className="min-w-0 flex-1 overflow-y-auto bg-stone-50">
      <div className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-8">
        <header>
          <h1 className="text-2xl font-bold text-stone-900 md:text-3xl">🌏 旅行目的地</h1>
          <p className="mt-1 text-sm text-stone-500">按大洲、国家浏览调研过的目的地，挑一个行程方案添加到自己的行程里。</p>
        </header>

        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatTile label="目的地" value={totals.destinations} hint="城市或旅行地区" />
          <StatTile label="国家和地区" value={totals.countries} hint={`分布在 ${totals.continents} 个大洲`} />
          <StatTile label="行程方案" value={totals.plans} hint="可直接添加到我的行程" />
          <StatTile label="调研地点" value={totals.places} hint="景点、餐厅、购物、住宿、交通" />
        </div>

        <div className="relative mt-5 h-[300px] overflow-hidden rounded-xl border border-stone-200 bg-white md:h-[380px]">
          <MapErrorBoundary>
            <PlacesMap
              points={points}
              selectedId={hovered}
              onSelect={setHovered}
              fitKey={`home-${continent}`}
              maxZoom={5}
            />
          </MapErrorBoundary>
        </div>

        <div className="mt-6 flex flex-wrap gap-2" role="tablist" aria-label="按大洲筛选">
          <ContinentChip active={!continent} onClick={() => setContinent(null)} label="全部" count={totals.countries} />
          {continentSummary.map((c) => (
            <ContinentChip
              key={c.continent}
              active={continent === c.continent}
              disabled={c.countries === 0}
              onClick={() => setContinent(c.continent)}
              label={c.continent}
              count={c.countries}
            />
          ))}
        </div>

        <div className="mt-5 space-y-8">
          {(continent ? continentsWithData.filter((c) => c.continent === continent) : continentsWithData).map((c) => (
            <section key={c.continent}>
              <SectionTitle aside={`${c.countries} 个国家和地区 · ${c.destinations} 个目的地`}>{c.continent}</SectionTitle>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {shownCountries
                  .filter((country) => country.continent === c.continent)
                  .map((country) => (
                    <CountryCard key={country.code} country={country} onHover={setHovered} />
                  ))}
              </div>
            </section>
          ))}

          <AddDestinationCard />
        </div>

        <MyTrips />
      </div>
    </div>
  )
}

function ContinentChip({
  label,
  count,
  active,
  disabled,
  onClick,
}: {
  label: string
  count: number
  active: boolean
  disabled?: boolean
  onClick: () => void
}) {
  return (
    <button
      role="tab"
      aria-selected={active}
      disabled={disabled}
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-sm transition ${
        active
          ? 'border-stone-800 bg-stone-800 text-white'
          : disabled
            ? 'cursor-default border-stone-200 text-stone-300'
            : 'border-stone-300 bg-white text-stone-600 hover:border-stone-400'
      }`}
    >
      {label} <span className={active ? 'text-stone-300' : 'text-stone-400'}>{count}</span>
    </button>
  )
}

function CountryCard({ country, onHover }: { country: CountryEntry; onHover: (slug: string | null) => void }) {
  return (
    <div className="flex flex-col rounded-xl border border-stone-200 bg-white p-5 transition hover:border-stone-300 hover:shadow-md">
      <a href={routeHref({ name: 'country', code: country.code })} className="group flex items-center gap-3">
        <span className="text-4xl leading-none">{flagEmoji(country.code)}</span>
        <div className="min-w-0 flex-1">
          <div className="text-lg font-semibold text-stone-900 group-hover:underline">{country.name}</div>
          <div className="text-xs text-stone-400">{country.continent}</div>
        </div>
        <span className="text-stone-300 transition group-hover:translate-x-0.5 group-hover:text-stone-500">›</span>
      </a>
      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <MiniStat value={country.destinations.length} label="目的地" />
        <MiniStat value={country.planCount} label="方案" />
        <MiniStat value={country.placeCount} label="调研地点" />
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {country.destinations.map((d) => (
          <a
            key={d.slug}
            href={routeHref({ name: 'destination', slug: d.slug })}
            onMouseEnter={() => onHover(d.slug)}
            onMouseLeave={() => onHover(null)}
            className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs text-stone-600 hover:bg-stone-200"
          >
            {d.name}
          </a>
        ))}
      </div>
    </div>
  )
}

function MiniStat({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-lg bg-stone-50 py-2">
      <div className="text-base font-semibold text-stone-800">{value.toLocaleString()}</div>
      <div className="text-[11px] text-stone-400">{label}</div>
    </div>
  )
}

function AddDestinationCard() {
  return (
    <div className="rounded-xl border border-dashed border-stone-300 px-5 py-4 text-sm text-stone-500">
      <span className="font-medium text-stone-700">＋ 添加新目的地：</span>
      在 Claude Code 里运行 <code className="rounded bg-stone-100 px-1.5 py-0.5 text-xs">/plan-trip 城市名 天数</code>
      ，调研完成并推送到 GitHub 后，会自动出现在这里。
      <a href={`${REPO_URL}#readme`} target="_blank" rel="noopener noreferrer" className="ml-1 underline">
        使用说明 ↗
      </a>
    </div>
  )
}

function MyTrips() {
  const trips = useTripStore((s) => s.trips)
  const selectTrip = useTripStore((s) => s.selectTrip)
  const recent = [...trips].sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 4)

  return (
    <section className="mt-10">
      <SectionTitle
        aside={
          trips.length > 0 && (
            <a href={routeHref({ name: 'trips' })} className="hover:text-stone-600">
              全部 {trips.length} 个 ›
            </a>
          )
        }
      >
        🧳 我的行程
      </SectionTitle>
      {recent.length === 0 ? (
        <p className="text-sm text-stone-400">还没有行程。从上面挑一个目的地，把行程方案添加进来吧。</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {recent.map((t) => {
            const dest = t.destination ? destinations.find((d) => d.slug === t.destination) : undefined
            return (
              <button
                key={t.id}
                onClick={() => {
                  selectTrip(t.id)
                  navigate({ name: 'trips' })
                }}
                className="rounded-xl border border-stone-200 bg-white p-4 text-left transition hover:border-stone-300 hover:shadow-md"
              >
                <div className="line-clamp-2 font-medium text-stone-800">
                  {dest && `${flagEmoji(dest.countryCode)} `}
                  {t.name}
                </div>
                <div className="mt-2 text-xs text-stone-400">
                  {formatDay(t.startDate)} 起 · {t.days.length} 天 · {tripStopCount(t)} 个地点
                </div>
              </button>
            )
          })}
        </div>
      )}
    </section>
  )
}
