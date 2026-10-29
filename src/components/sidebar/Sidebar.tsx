import { useEffect, useRef, useState } from 'react'
import { useTripStore } from '../../store/useTripStore'
import { addDays, today } from '../../lib/date'
import { destinations, getDestination, flagEmoji } from '../../lib/destinations'
import { navigate, routeHref, type Route } from '../../lib/router'
import DestinationTree from './DestinationTree'
import type { Trip } from '../../types'

export default function Sidebar({ route }: { route: Route }) {
  const trips = useTripStore((s) => s.trips)
  const currentTripId = useTripStore((s) => s.currentTripId)
  const selectTrip = useTripStore((s) => s.selectTrip)
  const createTrip = useTripStore((s) => s.createTrip)
  const deleteTrip = useTripStore((s) => s.deleteTrip)
  const importTrip = useTripStore((s) => s.importTrip)

  // 窄屏默认收起，给地图留空间
  const [collapsed, setCollapsed] = useState(() => window.innerWidth < 1024)
  // 手机上侧边栏是浮层，切换页面后自动收起
  useEffect(() => {
    if (window.innerWidth < 768) setCollapsed(true)
  }, [route])
  const [creating, setCreating] = useState(false)
  const [name, setName] = useState('')
  const [start, setStart] = useState(today())
  const [end, setEnd] = useState(addDays(today(), 2))
  const fileRef = useRef<HTMLInputElement>(null)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || end < start) return
    createTrip(name.trim(), start, end)
    navigate({ name: 'trips' })
    setCreating(false)
    setName('')
  }

  const exportTrip = () => {
    const trip = trips.find((t) => t.id === currentTripId)
    if (!trip) return
    const blob = new Blob([JSON.stringify(trip, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `${trip.name}.json`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const onImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      const trip = JSON.parse(await file.text()) as Trip
      if (!trip.name || !Array.isArray(trip.days)) throw new Error('格式不对')
      importTrip(trip)
      navigate({ name: 'trips' })
    } catch {
      alert('导入失败：不是有效的行程文件')
    }
  }

  if (collapsed) {
    return (
      <aside className="flex w-11 shrink-0 flex-col items-center border-r border-stone-200 bg-stone-100/70 pt-3">
        <button
          title="展开行程列表"
          onClick={() => setCollapsed(false)}
          className="rounded-md p-1.5 hover:bg-stone-200/60"
        >
          🧳
        </button>
        <a title="首页" href={routeHref({ name: 'home' })} className="mt-1 rounded-md p-1.5 hover:bg-stone-200/60">
          🏠
        </a>
      </aside>
    )
  }

  return (
    <>
    {/* 手机上展开时盖在页面上，点遮罩收起 */}
    <div className="fixed inset-0 z-30 bg-black/30 md:hidden" onClick={() => setCollapsed(true)} />
    <aside className="flex w-56 shrink-0 flex-col border-r border-stone-200 bg-stone-100 max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:z-40 max-md:w-64 max-md:shadow-xl md:bg-stone-100/70">
      <div className="flex items-center justify-between px-2 pb-1 pt-3">
        <a
          href={routeHref({ name: 'home' })}
          className={`flex-1 rounded-md px-2 py-1.5 text-sm font-semibold ${
            route.name === 'home' ? 'bg-white text-stone-800 shadow-sm' : 'text-stone-600 hover:bg-stone-200/60'
          }`}
        >
          🏠 首页
        </a>
        <button title="收起" onClick={() => setCollapsed(true)} className="ml-1 rounded px-1.5 py-1 text-stone-500 hover:bg-stone-200/60">
          «
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-2">
        <div className="px-2 pb-1 pt-3 text-sm font-semibold text-stone-500">🧳 我的行程</div>
        {trips.map((t) => (
          <div
            key={t.id}
            onClick={() => {
              selectTrip(t.id)
              navigate({ name: 'trips' })
            }}
            className={`group flex cursor-pointer items-center justify-between gap-1 rounded-md px-2 py-1.5 text-sm ${
              route.name === 'trips' && t.id === currentTripId ? 'bg-white font-medium shadow-sm' : 'hover:bg-stone-200/60'
            }`}
          >
            <span className="truncate">
              {tripFlag(t.destination)}
              {t.name}
            </span>
            <button
              title="删除行程"
              onClick={(e) => {
                e.stopPropagation()
                if (confirm(`删除「${t.name}」？此操作无法撤销`)) deleteTrip(t.id)
              }}
              className="hidden text-stone-400 hover:text-red-500 group-hover:block"
            >
              ✕
            </button>
          </div>
        ))}

        {creating ? (
          <form onSubmit={submit} className="mt-2 space-y-2 rounded-md bg-white p-2 text-sm shadow-sm">
            <input
              autoFocus
              placeholder="行程名称"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded border border-stone-200 px-2 py-1"
            />
            <label className="block text-xs text-stone-500">
              开始
              <input type="date" value={start} onChange={(e) => setStart(e.target.value)}
                className="mt-0.5 w-full rounded border border-stone-200 px-2 py-1" />
            </label>
            <label className="block text-xs text-stone-500">
              结束
              <input type="date" value={end} min={start} onChange={(e) => setEnd(e.target.value)}
                className="mt-0.5 w-full rounded border border-stone-200 px-2 py-1" />
            </label>
            <div className="flex gap-2">
              <button type="submit" className="flex-1 rounded bg-stone-800 py-1 text-white">创建</button>
              <button type="button" onClick={() => setCreating(false)} className="flex-1 rounded bg-stone-100 py-1">取消</button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setCreating(true)}
            className="mt-1 w-full rounded-md px-2 py-1.5 text-left text-sm text-stone-500 hover:bg-stone-200/60"
          >
            ＋ 新建行程
          </button>
        )}

        <div className="mt-5 flex items-center justify-between px-2 pb-1 text-sm font-semibold text-stone-500">
          <span>🌏 目的地</span>
          <a href={routeHref({ name: 'home' })} className="text-xs font-normal text-stone-400 hover:text-stone-700">
            全部 {destinations.length} ›
          </a>
        </div>
        <DestinationTree route={route} />
      </nav>

      <div className="flex gap-1 border-t border-stone-200 p-2 text-xs">
        <button onClick={exportTrip} className="flex-1 rounded px-2 py-1.5 text-stone-500 hover:bg-stone-200/60">导出 JSON</button>
        <button onClick={() => fileRef.current?.click()} className="flex-1 rounded px-2 py-1.5 text-stone-500 hover:bg-stone-200/60">导入</button>
        <input ref={fileRef} type="file" accept=".json,application/json" hidden onChange={onImport} />
      </div>
    </aside>
    </>
  )
}

/** 从目的地添加的行程，名称前显示国旗 */
function tripFlag(slug?: string) {
  const d = slug ? getDestination(slug) : undefined
  return d ? `${flagEmoji(d.countryCode)} ` : ''
}
