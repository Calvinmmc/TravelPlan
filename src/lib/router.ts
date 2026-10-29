import { useSyncExternalStore } from 'react'

/**
 * 基于 URL hash 的路由，GitHub Pages 这类静态托管也能直接分享链接：
 *   #/                  我的行程
 *   #/explore           全部目的地
 *   #/explore/<slug>    某个目的地
 *   #/s/<payload>       别人分享的行程（内容在链接里，见 lib/share.ts）
 */
export type Route =
  | { name: 'trips' }
  | { name: 'explore' }
  | { name: 'destination'; slug: string }
  | { name: 'shared'; payload: string }

export function parseHash(hash: string): Route {
  const parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent)
  if (parts[0] === 's' && parts[1]) return { name: 'shared', payload: parts[1] }
  if (parts[0] === 'explore') return parts[1] ? { name: 'destination', slug: parts[1] } : { name: 'explore' }
  return { name: 'trips' }
}

export function routeHref(route: Route) {
  switch (route.name) {
    case 'trips':
      return '#/'
    case 'explore':
      return '#/explore'
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
