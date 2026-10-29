import type { ReactNode } from 'react'
import { flagEmoji, type DestinationEntry } from '../../lib/destinations'
import { CATEGORY_META, CATEGORY_ORDER } from '../../lib/places'
import { routeHref } from '../../lib/router'
import type { MapPoint } from '../map/PlacesMap'

/** 统计卡片：标签 + 数字 + 说明 */
export function StatTile({ label, value, hint }: { label: string; value: number; hint?: string }) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white px-4 py-3">
      <div className="text-xs text-stone-500">{label}</div>
      <div className="mt-1 text-2xl font-semibold text-stone-900">{value.toLocaleString()}</div>
      {hint && <div className="mt-0.5 truncate text-xs text-stone-400">{hint}</div>}
    </div>
  )
}

export function SectionTitle({ children, aside }: { children: ReactNode; aside?: ReactNode }) {
  return (
    <div className="mb-3 flex items-baseline justify-between gap-3">
      <h2 className="text-base font-semibold text-stone-800">{children}</h2>
      {aside && <div className="text-sm text-stone-400">{aside}</div>}
    </div>
  )
}

/** 目的地卡片：名称、简介、方案数、各类调研地点数 */
export function DestinationCard({ dest, onHover }: { dest: DestinationEntry; onHover?: (slug: string | null) => void }) {
  const cats = CATEGORY_ORDER.filter((c) => c !== 'transport' && dest.stats?.byCategory[c])
  return (
    <a
      href={routeHref({ name: 'destination', slug: dest.slug })}
      onMouseEnter={() => onHover?.(dest.slug)}
      onMouseLeave={() => onHover?.(null)}
      className="group block rounded-xl border border-stone-200 bg-white p-4 transition hover:border-stone-300 hover:shadow-md"
    >
      <div className="flex items-baseline justify-between gap-2">
        <div className="min-w-0">
          <span className="text-lg font-semibold text-stone-900">{dest.name}</span>
          {dest.localName && <span className="ml-2 text-xs text-stone-400">{dest.localName}</span>}
        </div>
        <span className="shrink-0 text-sm text-stone-300 transition group-hover:translate-x-0.5 group-hover:text-stone-500">›</span>
      </div>
      {dest.region && <div className="text-xs text-stone-400">{dest.region}</div>}
      {dest.summary && <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-stone-600">{dest.summary}</p>}
      <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-stone-500">
        <span>📅 {dest.plans.length} 个行程方案</span>
        {cats.map((c) => (
          <span key={c}>
            {CATEGORY_META[c].emoji} {CATEGORY_META[c].label} {dest.stats!.byCategory[c]}
          </span>
        ))}
      </div>
    </a>
  )
}

/** 地图上的目的地标记（胶囊形，国旗 + 名称） */
export function destinationPoints(list: DestinationEntry[]): MapPoint[] {
  return list
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
        lines: [d.summary, `${d.plans.length} 个行程方案${d.stats ? ` · ${d.stats.places} 个调研地点` : ''}`].filter(
          (x): x is string => !!x,
        ),
        link: { href: routeHref({ name: 'destination', slug: d.slug }), text: `进入${d.name} ›` },
      },
    }))
}
