import { TRANSPORT_LABELS, type Trip } from '../../types'
import { dayColor } from '../../lib/colors'
import { formatDay } from '../../lib/date'
import { formatCost, tripStopCount, tripTotalCost } from '../../lib/tripView'

interface Props {
  trip: Trip
  /** 导出长图时放在开头的路线图 */
  mapImage?: string | null
  /** 地图是示意图（没有底图）时不显示地图版权 */
  mapIsSchematic?: boolean
  selectedStopId?: string | null
  onStopClick?: (id: string) => void
}

/** 只读的行程文档：分享页的列表、导出长图 / PDF 的内容都用它 */
export default function TripDocument({ trip, mapImage, mapIsSchematic, selectedStopId, onStopClick }: Props) {
  const total = tripTotalCost(trip)
  return (
    <article className="trip-doc text-stone-800">
      <h1 className="text-2xl font-bold">{trip.name}</h1>
      <p className="mt-1 text-sm text-stone-500">
        {formatDay(trip.startDate)} → {formatDay(trip.endDate)} · {trip.days.length} 天 · {tripStopCount(trip)} 个地点
        {total > 0 && ` · 预计花费 ${formatCost(trip, total)}`}
      </p>

      {mapImage && (
        <figure className="mt-4">
          <img src={mapImage} alt="路线图" className="w-full rounded-lg border border-stone-200" />
          <figcaption className="mt-1 flex flex-wrap gap-x-3 text-[11px] text-stone-400">
            {trip.days.map((d, i) => (
              <span key={d.id}>
                <span style={{ color: dayColor(i) }}>●</span> D{i + 1}
              </span>
            ))}
            <span>虚线 = 飞机 / 船</span>
            {!mapIsSchematic && <span className="ml-auto">地图 © OpenStreetMap · OpenFreeMap</span>}
          </figcaption>
        </figure>
      )}

      <div className="mt-5 space-y-5">
        {trip.days.map((day, di) => (
          <section key={day.id} className="break-inside-avoid-page">
            <h2 className="flex items-baseline gap-2 border-b pb-1" style={{ borderColor: `${dayColor(di)}55` }}>
              <span className="rounded px-1.5 py-0.5 text-xs font-bold text-white" style={{ background: dayColor(di) }}>
                D{di + 1}
              </span>
              <span className="text-sm font-semibold">{formatDay(day.date)}</span>
              {day.title && <span className="text-sm text-stone-500">{day.title}</span>}
            </h2>
            {day.stops.length === 0 && <p className="mt-2 text-sm text-stone-400">（未安排）</p>}
            <ol className="mt-2 space-y-2">
              {day.stops.map((s, si) => (
                <li
                  key={s.id}
                  onClick={onStopClick && (() => onStopClick(s.id))}
                  className={`flex gap-3 rounded-md px-1 py-0.5 ${onStopClick ? 'cursor-pointer hover:bg-stone-50' : ''} ${
                    selectedStopId === s.id ? 'bg-stone-100' : ''
                  }`}
                >
                  <div className="w-11 shrink-0 pt-0.5 text-right text-xs tabular-nums text-stone-400">{s.time ?? ''}</div>
                  <span
                    className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-[11px] font-semibold text-white"
                    style={{ background: dayColor(di) }}
                  >
                    {si + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium">{s.name || '未命名地点'}</div>
                    {(s.transport || s.cost !== undefined) && (
                      <div className="text-xs text-stone-400">
                        {[s.transport && TRANSPORT_LABELS[s.transport], formatCost(trip, s.cost)].filter(Boolean).join(' · ')}
                      </div>
                    )}
                    {s.note && <p className="mt-0.5 text-sm leading-relaxed text-stone-600">{s.note}</p>}
                  </div>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </article>
  )
}
