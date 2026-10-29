import { useState } from 'react'
import { destinations, flagEmoji, groupDestinations, matchDestination } from '../../lib/destinations'
import { routeHref, type Route } from '../../lib/router'

/** 目的地多于这个数量时显示搜索框 */
const SEARCH_THRESHOLD = 8

/**
 * 侧边栏里的目的地目录：大洲 → 国家 → 目的地。
 * 某一层只有一个分组时不显示这一层（只有一个大洲就不显示大洲），城市多了自然展开成多级。
 */
export default function DestinationTree({ route }: { route: Route }) {
  const [query, setQuery] = useState('')
  const [closed, setClosed] = useState<Set<string>>(new Set())

  const groups = groupDestinations(destinations.filter((d) => matchDestination(d, query)))
  const showContinent = groupDestinations(destinations).length > 1
  const currentSlug = route.name === 'destination' ? route.slug : null

  const toggle = (key: string) =>
    setClosed((s) => {
      const next = new Set(s)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })

  return (
    <div>
      {destinations.length > SEARCH_THRESHOLD && (
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索目的地…"
          className="mb-1 w-full rounded border border-stone-200 bg-white px-2 py-1 text-xs outline-none focus:border-stone-400"
        />
      )}
      {groups.map((g) => {
        // 搜索时全部展开
        const open = query !== '' || !closed.has(g.continent)
        return (
          <div key={g.continent}>
            {showContinent && (
              <button
                onClick={() => toggle(g.continent)}
                className="flex w-full items-center gap-1 px-2 pb-0.5 pt-2 text-xs font-semibold text-stone-400 hover:text-stone-600"
              >
                <span className="w-3">{open ? '▾' : '▸'}</span>
                {g.continent}
                <span className="font-normal">{g.countries.reduce((n, c) => n + c.destinations.length, 0)}</span>
              </button>
            )}
            {open &&
              g.countries.map((c) => (
                <div key={c.countryCode} className={showContinent ? 'pl-3' : ''}>
                  <div className="px-2 pb-0.5 pt-1.5 text-xs text-stone-400">
                    {flagEmoji(c.countryCode)} {c.country}
                  </div>
                  {c.destinations.map((d) => (
                    <a
                      key={d.slug}
                      href={routeHref({ name: 'destination', slug: d.slug })}
                      className={`flex items-center justify-between rounded-md py-1 pl-6 pr-2 text-sm ${
                        currentSlug === d.slug ? 'bg-white font-medium shadow-sm' : 'text-stone-600 hover:bg-stone-200/60'
                      }`}
                    >
                      <span className="truncate">{d.name}</span>
                      <span className="shrink-0 text-xs text-stone-400">{d.plans.length}</span>
                    </a>
                  ))}
                </div>
              ))}
          </div>
        )
      })}
      {groups.length === 0 && <p className="px-2 py-1 text-xs text-stone-400">没有匹配的目的地</p>}
    </div>
  )
}
