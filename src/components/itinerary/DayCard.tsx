import { TRANSPORT_LABELS, type Day } from '../../types'
import { useTripStore } from '../../store/useTripStore'
import { dayColor } from '../../lib/colors'
import { formatDay } from '../../lib/date'
import { distanceKm, formatDistance } from '../../lib/geo'
import StopCard from './StopCard'

export default function DayCard({ day, index }: { day: Day; index: number }) {
  const updateDay = useTripStore((s) => s.updateDay)
  const addingToDayId = useTripStore((s) => s.addingToDayId)
  const setAddingTo = useTripStore((s) => s.setAddingTo)
  const dayFilter = useTripStore((s) => s.dayFilter)
  const setDayFilter = useTripStore((s) => s.setDayFilter)

  const color = dayColor(index)
  const adding = addingToDayId === day.id
  const total = day.stops.reduce(
    (sum, s, i) => (i === 0 ? 0 : sum + distanceKm(day.stops[i - 1], s)),
    0,
  )

  return (
    <div>
      <div className="mb-2 flex items-center gap-2 px-2">
        <button
          title={dayFilter === day.id ? '显示全部' : '地图只看这天'}
          onClick={() => setDayFilter(dayFilter === day.id ? null : day.id)}
          className="rounded px-1.5 py-0.5 text-xs font-bold text-white"
          style={{
            background: color,
            outline: dayFilter === day.id ? `2px solid ${color}` : undefined,
            outlineOffset: 2,
          }}
        >
          D{index + 1}
        </button>
        <span className="text-sm font-medium text-stone-600">{formatDay(day.date)}</span>
        <input
          value={day.title ?? ''}
          placeholder="添加主题…"
          onChange={(e) => updateDay(day.id, { title: e.target.value })}
          className="min-w-0 flex-1 bg-transparent text-sm text-stone-500 outline-none placeholder:text-stone-300"
        />
        {total > 0 && <span className="shrink-0 text-xs text-stone-400">≈{formatDistance(total)}</span>}
      </div>

      <div className="ml-4 border-l-2 pl-3" style={{ borderColor: `${color}55` }}>
        {day.stops.map((stop, i) => (
          <div key={stop.id}>
            {i > 0 && (
              <div className="py-0.5 pl-2 text-[11px] text-stone-400">
                ↓ {formatDistance(distanceKm(day.stops[i - 1], stop))}
                {stop.transport && ` · ${TRANSPORT_LABELS[stop.transport]}`}
              </div>
            )}
            <StopCard
              stop={stop}
              index={i}
              color={color}
              isFirst={i === 0}
              isLast={i === day.stops.length - 1}
            />
          </div>
        ))}

        <button
          onClick={() => setAddingTo(adding ? null : day.id)}
          className={`mt-2 w-full rounded-md border border-dashed px-3 py-1.5 text-left text-sm ${
            adding
              ? 'border-transparent text-white'
              : 'border-stone-200 text-stone-400 hover:border-stone-300 hover:text-stone-600'
          }`}
          style={adding ? { background: color } : undefined}
        >
          {adding ? '📍 在地图上点击添加地点…（再点这里取消）' : '＋ 添加地点'}
        </button>
      </div>
    </div>
  )
}
