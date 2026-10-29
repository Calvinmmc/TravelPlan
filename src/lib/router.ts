import { useSyncExternalStore } from 'react'

/**
 * 基于 URL hash 的路由，GitHub Pages 这类静态托管也能直接分享链接：
 *   #/                  首页：按大洲、国家浏览目的地（#/explore 是旧链接，也到这里）
 *   #/trips             我的行程
 *   #/country/<代码>     某个国家，如 #/country/JP
 *   #/explore/<slug>    某个目的地
 *   #/s/<payload>       别人分享的行程（内容在链接里，见 lib/share.ts）
 */
export type Route =
  | { name: 'home' }
  | { name: 'trips' }
  | { name: 'country'; code: string }
  | { name: 'destination'; slug: string }
  | { name: 'shared'; payload: string }

export function parseHash(hash: string): Route {
  const parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent)
  if (parts[0] === 's' && parts[1]) return { name: 'shared', payload: parts[1] }
  if (parts[0] === 'trips') return { name: 'trips' }
  if (parts[0] === 'country' && parts[1]) return { name: 'country', code: parts[1].toUpperCase() }
  if (parts[0] === 'explore' && parts[1]) return { name: 'destination', slug: parts[1] }
  return { name: 'home' }
}

export function routeHref(route: Route) {
  switch (route.name) {
    case 'home':
      return '#/'
    case 'trips':
      return '#/trips'
    case 'country':
      return `#/country/${route.code}`
    case 'destination':
      return `#/explore/${encodeURIComponent(route.slug)}`
    case 'shared':
      return `#/s/${route.payload}`
  }
}

export const navigate = (route: Route) => {
  window.location.hash = routeHref(route)
}

const subscribe = (cb: () => void) => {
  window.addEventListener('hashchange', cb)
  return () => window.removeEventListener('hashchange', cb)
}

let cached: { hash: string; route: Route } | null = null
const getRoute = () => {
  const hash = window.location.hash
  if (cached?.hash !== hash) cached = { hash, route: parseHash(hash) }
  return cached.route
}

export const useRoute = () => useSyncExternalStore(subscribe, getRoute)
