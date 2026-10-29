import { useMemo, useState } from 'react'
import { destinations, flagEmoji, groupDestinations, matchDestination } from '../../lib/destinations'
import { navigate, routeHref } from '../../lib/router'
import PlacesMap, { type MapPoint } from '../map/PlacesMap'
import MapErrorBoundary from '../map/MapErrorBoundary'

/** 目的地多于这个数量时显示搜索框 */
const SEARCH_THRESHOLD = 6

/** 全部目的地：按 大洲 → 国家 分组的列表 + 世界地图 */
export default function ExploreView() {
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const filtered = destinations.filter((d) => matchDestination(d, query))
  const groups = groupDestinations(filtered)
  // 只有一个大洲时不显示大洲这一层
  const showContinent = groupDestinations(destinations).length > 1
  const countryCount = new Set(destinations.map((d) => d.countryCode)).size

  const points = useMemo<MapPoint[]>(
    () =>
      filtered
        .filter((d) => d.lat !== undefined && d.lng !== undefined)
        .map((d) => ({
          id: d.slug,
          lng: d.lng!,
          lat: d.lat!,
          color: '#1c1917',
          label: `${flagEmoji(d.countryCode)} ${d.name}`,
          shape: 'pill',
          popup: {
            title: `${flagEmoji(d.countryCode)} ${d.name}`,
            subtitle: [d.localName, d.country].filter(Boolean).join(' · '),
            lines: [d.summary, `${d.plans.length} 个行程方案`].filter((x): x is string => !!x),
            link: { href: routeHref({ name: 'destination', slug: d.slug }), text: `进入${d.name} ›` },
          },
        })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [query],
  )

  return (
    <div className="flex min-w-0 flex-1 flex-col-reverse md:flex-row">
      <section className="flex h-[55%] min-h-0 shrink-0 flex-col border-t border-stone-200 bg-white md:h-auto md:w-[clamp(300px,40vw,440px)] md:border-r md:border-t-0">
        <header className="border-b border-stone-100 px-4 pb-3 pt-4 md:px-6 md:pb-4 md:pt-6">
          <h1 className="text-xl font-bold md:text-2xl">🌏 全部目的地</h1>
          <p className="mt-1 text-xs text-stone-400">
            {destinations.length} 个目的地 · {countryCount} 个国家/地区 · 用 /plan-trip 调研后自动出现在这里
          </p>
          {destinations.length > SEARCH_THRESHOLD && (
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索城市、国家或大洲…"
              className="mt-3 w-full rounded-md border border-stone-200 px-3 py-1.5 text-sm outline-none focus:border-stone-400"
            />
          )}
        </header>

        <div className="flex-1 space-y-5 overflow-y-auto px-4 py-4">
          {groups.length === 0 && <p className="text-sm text-stone-400">没有匹配的目的地</p>}
          {groups.map((g) => (
            <div key={g.continent}>
              {showContinent && <h2 className="mb-2 text-sm font-semibold text-stone-500">{g.continent}</h2>}
              <div className="space-y-3">
                {g.countries.map((c) => (
                  <div key={c.countryCode}>
                    <h3 className="mb-1 px-1 text-xs font-medium text-stone-400">
                      {flagEmoji(c.countryCode)} {c.country}
                    </h3>
                    <div className="space-y-2">
                      {c.destinations.map((d) => (
                        <button
                          key={d.slug}
                          onClick={() => navigate({ name: 'destination', slug: d.slug })}
                          onMouseEnter={() => setSelectedId(d.slug)}
                          className="block w-full rounded-lg border border-stone-200 px-4 py-3 text-left transition hover:border-stone-300 hover:bg-stone-50"
                        >
                          <div className="flex items-baseline gap-2">
                            <span className="font-semibold">{d.name}</span>
                            {d.localName && <span className="truncate text-xs text-stone-400">{d.localName}</span>}
                          </div>
                          {d.summary && <p className="mt-1 line-clamp-2 text-sm text-stone-500">{d.summary}</p>}
                          <div className="mt-2 flex gap-3 text-xs text-stone-400">
                            <span>📅 {d.plans.length} 个行程方案</span>
                            {d.hasResearch && <span>🔎 有调研资料</span>}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <main className="relative min-h-0 min-w-0 flex-1">
        <MapErrorBoundary>
          <PlacesMap points={points} selectedId={selectedId} onSelect={setSelectedId} fitKey={`explore-${query}`} maxZoom={6} />
        </MapErrorBoundary>
      </main>
    </div>
  )
}
