import { useEffect, useMemo, useState } from 'react'
import type { PlaceCategory, ResearchFile } from '../../types/research'
import { flagEmoji, getDestination, loadResearch, type DestinationEntry } from '../../lib/destinations'
import { CATEGORY_META, CATEGORY_ORDER, formatPrice, placeSubtitle } from '../../lib/places'
import { formatDay } from '../../lib/date'
import { navigate, routeHref } from '../../lib/router'
import { useTripStore } from '../../store/useTripStore'
import { REPO_URL } from '../../config'
import PlacesMap, { type MapPoint } from '../map/PlacesMap'
import MapErrorBoundary from '../map/MapErrorBoundary'

export default function DestinationView({ slug }: { slug: string }) {
  const dest = getDestination(slug)
  if (!dest) {
    return (
      <div className="grid flex-1 place-items-center text-center text-stone-400">
        <div>
          <p>找不到目的地「{slug}」</p>
          <a href={routeHref({ name: 'home' })} className="mt-2 inline-block text-sm text-stone-600 underline">
            回到首页
          </a>
        </div>
      </div>
    )
  }
  // key：切换目的地时重置筛选、选中状态和已加载的调研数据
  return <DestinationDetail key={slug} dest={dest} />
}

function DestinationDetail({ dest }: { dest: DestinationEntry }) {
  const [research, setResearch] = useState<ResearchFile | null>(null)
  const [loading, setLoading] = useState(dest.hasResearch)
  const [category, setCategory] = useState<PlaceCategory | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    if (!dest.hasResearch) return
    loadResearch(dest.slug).then((r) => {
      setResearch(r)
      setLoading(false)
    })
  }, [dest])

  const places = research?.places ?? []
  const visible = places.filter((p) => !category || p.category === category)
  const counts = CATEGORY_ORDER.map((c) => [c, places.filter((p) => p.category === c).length] as const).filter(([, n]) => n > 0)

  const points = useMemo<MapPoint[]>(
    () =>
      visible.map((p) => {
        const meta = CATEGORY_META[p.category]
        return {
          id: p.id,
          lng: p.lng,
          lat: p.lat,
          color: meta.color,
          label: meta.emoji,
          popup: {
            title: p.name,
            subtitle: placeSubtitle(p),
            lines: [formatPrice(p.price), p.hours, p.tips].filter((x): x is string => !!x),
            link: p.sources[0] ? { href: p.sources[0], text: '信息来源 ↗' } : undefined,
          },
        }
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [research, category],
  )

  return (
    <div className="flex min-w-0 flex-1 flex-col-reverse md:flex-row">
      <section className="flex h-[55%] min-h-0 shrink-0 flex-col border-t border-stone-200 bg-white md:h-auto md:w-[clamp(300px,40vw,440px)] md:border-r md:border-t-0">
        <div className="flex-1 overflow-y-auto">
          <header className="border-b border-stone-100 px-4 pb-4 pt-4 md:px-6 md:pt-6">
            <nav className="text-xs text-stone-400">
              <a href={routeHref({ name: 'home' })} className="hover:text-stone-600">
                首页
              </a>
              {' › '}
              {dest.continent}
              {' › '}
              <a href={routeHref({ name: 'country', code: dest.countryCode })} className="hover:text-stone-600">
                {flagEmoji(dest.countryCode)} {dest.country}
              </a>
              {dest.region && ` › ${dest.region}`}
            </nav>
            <h1 className="mt-2 text-xl font-bold md:text-2xl">{dest.name}</h1>
            {dest.localName && <p className="text-sm text-stone-400">{dest.localName}</p>}
            {dest.summary && <p className="mt-2 text-sm text-stone-600">{dest.summary}</p>}
          </header>

          <PlanList dest={dest} />

          <div className="px-4 pb-6 pt-2 md:px-6">
            <div className="mb-2 flex items-baseline justify-between">
              <h2 className="text-sm font-semibold text-stone-600">🔎 调研资料</h2>
              {research && (
                <a
                  href={`${REPO_URL}/blob/main/research/${dest.slug}/README.md`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-stone-400 underline hover:text-stone-600"
                >
                  完整调研表 ↗
                </a>
              )}
            </div>
            {loading && <p className="text-sm text-stone-400">加载中…</p>}
            {!dest.hasResearch && <p className="text-sm text-stone-400">这个目的地还没有调研资料。</p>}
            {research && (
              <>
                <p className="mb-2 text-xs text-stone-400">
                  调研于 {research.generatedAt}
                  {research.travelMonth && `，按 ${research.travelMonth} 出行`} · 价格仅供参考，出发前请再确认
                </p>
                <div className="mb-3 flex flex-wrap gap-1">
                  <Chip active={!category} onClick={() => setCategory(null)}>
                    全部 {places.length}
                  </Chip>
                  {counts.map(([c, n]) => (
                    <Chip key={c} active={category === c} color={CATEGORY_META[c].color} onClick={() => setCategory(c)}>
                      {CATEGORY_META[c].emoji} {CATEGORY_META[c].label} {n}
                    </Chip>
                  ))}
                </div>
                <ul className="space-y-1">
                  {[...visible]
                    .sort((a, b) => a.area.localeCompare(b.area, 'zh') || a.name.localeCompare(b.name, 'zh'))
                    .map((p) => (
                      <li key={p.id}>
                        <button
                          onClick={() => setSelectedId(p.id)}
                          className={`w-full rounded-md px-2 py-1.5 text-left text-sm ${
                            selectedId === p.id ? 'bg-stone-100' : 'hover:bg-stone-50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span>{CATEGORY_META[p.category].emoji}</span>
                            <span className="min-w-0 flex-1 truncate font-medium">{p.name}</span>
                            <span className="shrink-0 text-xs text-stone-400">{p.area}</span>
                          </div>
                          {p.price && <div className="pl-6 text-xs text-stone-400">{formatPrice(p.price)}</div>}
                        </button>
                      </li>
                    ))}
                </ul>
                {research.notes.length > 0 && (
                  <details className="mt-4 rounded-md bg-amber-50 px-3 py-2 text-sm text-stone-600">
                    <summary className="cursor-pointer font-medium">⚠️ 出行要点（{research.notes.length}）</summary>
                    <ul className="mt-2 list-disc space-y-1 pl-4 text-xs leading-relaxed">
                      {research.notes.map((n, i) => (
                        <li key={i}>{n}</li>
                      ))}
                    </ul>
                  </details>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      <main className="relative min-h-0 min-w-0 flex-1">
        <MapErrorBoundary>
          <PlacesMap
            points={points}
            selectedId={selectedId}
            onSelect={setSelectedId}
            fitKey={`${dest.slug}-${category}-${!!research}`}
            // 「全部」时不按交通节点缩放：出发城市的机场等会把地图拉得很远
            fitPoints={category ? undefined : visible.filter((p) => p.category !== 'transport')}
          />
        </MapErrorBoundary>
      </main>
    </div>
  )
}

function PlanList({ dest }: { dest: DestinationEntry }) {
  const myTrips = useTripStore((s) => s.trips)
  const importTrip = useTripStore((s) => s.importTrip)

  const add = (plan: DestinationEntry['plans'][number]) => {
    importTrip({ ...plan.trip, destination: dest.slug })
    navigate({ name: 'trips' })
  }

  return (
    <div className="px-4 py-4 md:px-6">
      <h2 className="mb-2 text-sm font-semibold text-stone-600">📅 行程方案（{dest.plans.length}）</h2>
      <div className="space-y-2">
        {dest.plans.map((plan) => {
          const { trip } = plan
          const stops = trip.days.reduce((n, d) => n + d.stops.length, 0)
          const cost = trip.days.reduce((n, d) => n + d.stops.reduce((m, s) => m + (s.cost ?? 0), 0), 0)
          const added = myTrips.some((t) => t.destination === dest.slug && t.name === trip.name)
          return (
            <div key={plan.key} className="rounded-lg border border-stone-200 p-3">
              <div className="font-medium">{trip.name}</div>
              {trip.destinations && trip.destinations.length > 1 && (
                <div className="mt-0.5 text-xs text-stone-500">
                  途经：
                  {trip.destinations.map((slug, i) => {
                    const d = getDestination(slug)
                    return (
                      <span key={slug}>
                        {i > 0 && ' → '}
                        {d && slug !== dest.slug ? (
                          <a href={routeHref({ name: 'destination', slug })} className="underline hover:text-stone-700">
                            {d.name}
                          </a>
                        ) : (
                          (d?.name ?? slug)
                        )}
                      </span>
                    )
                  })}
                </div>
              )}
              <div className="mt-1 flex flex-wrap gap-x-3 text-xs text-stone-400">
                <span>
                  {formatDay(trip.startDate)} → {formatDay(trip.endDate)}
                </span>
                <span>{trip.days.length} 天</span>
                <span>{stops} 个地点</span>
                {cost > 0 && (
                  <span>
                    约 {trip.currency ?? ''} {cost.toLocaleString()}
                  </span>
                )}
              </div>
              <ol className="mt-2 space-y-0.5 text-xs text-stone-500">
                {trip.days.map((d, i) => (
                  <li key={d.id} className="truncate">
                    <span className="font-medium text-stone-600">D{i + 1}</span> {d.title ?? d.stops.map((s) => s.name).join(' → ')}
                  </li>
                ))}
              </ol>
              <button
                onClick={() => add(plan)}
                className="mt-3 w-full rounded-md bg-stone-800 py-1.5 text-sm text-white hover:bg-stone-700"
              >
                {added ? '已在我的行程中 · 再添加一份' : '＋ 添加到我的行程'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Chip({
  active,
  color = '#1c1917',
  onClick,
  children,
}: {
  active: boolean
  color?: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-full border px-2.5 py-0.5 text-xs"
      style={active ? { background: color, borderColor: color, color: '#fff' } : { borderColor: '#e7e5e4', color: '#57534e' }}
    >
      {children}
    </button>
  )
}
