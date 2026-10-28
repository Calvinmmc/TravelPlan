import { useEffect, useRef } from 'react'
import { TRANSPORT_LABELS, type Stop, type Transport } from '../../types'
import { useTripStore } from '../../store/useTripStore'

interface Props {
  stop: Stop
  index: number
  color: string
  isFirst: boolean
  isLast: boolean
}

const field = 'rounded border border-stone-200 bg-white px-2 py-1 text-sm outline-none focus:border-stone-400'

export default function StopCard({ stop, index, color, isFirst, isLast }: Props) {
  const selected = useTripStore((s) => s.selectedStopId === stop.id)
  const selectStop = useTripStore((s) => s.selectStop)
  const updateStop = useTripStore((s) => s.updateStop)
  const removeStop = useTripStore((s) => s.removeStop)
  const moveStop = useTripStore((s) => s.moveStop)
  const ref = useRef<HTMLDivElement>(null)

  // 地图上点了标记 → 列表滚动到这张卡片
  useEffect(() => {
    if (selected) ref.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [selected])

  const update = (patch: Partial<Stop>) => updateStop(stop.id, patch)
  // 第一站的交通方式不在两站之间的连线上，单独显示在卡片里
  const showTransport = !!stop.transport && isFirst

  return (
    <div
      ref={ref}
      onClick={() => !selected && selectStop(stop.id)}
      className={`group rounded-lg border px-3 py-2 transition ${
        selected ? 'border-stone-300 bg-stone-50 shadow-sm' : 'cursor-pointer border-transparent hover:bg-stone-50'
      }`}
    >
      <div className="flex items-center gap-2">
        <span
          className="grid h-5 w-5 shrink-0 place-items-center rounded-full text-[11px] font-semibold text-white"
          style={{ background: color }}
        >
          {index + 1}
        </span>
        {selected ? (
          <input
            autoFocus={!stop.name}
            value={stop.name}
            placeholder="地点名称"
            onChange={(e) => update({ name: e.target.value })}
            className="min-w-0 flex-1 bg-transparent font-medium outline-none"
          />
        ) : (
          <span className="min-w-0 flex-1 truncate font-medium">{stop.name || '未命名地点'}</span>
        )}
        {stop.time && <span className="text-xs text-stone-400">{stop.time}</span>}
        {selected && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              selectStop(null)
            }}
            className="text-xs text-stone-400 hover:text-stone-700"
          >
            收起
          </button>
        )}
      </div>

      {!selected && (showTransport || stop.note) && (
        <div className="mt-0.5 truncate pl-7 text-xs text-stone-400">
          {[showTransport && TRANSPORT_LABELS[stop.transport!], stop.note].filter(Boolean).join(' · ')}
        </div>
      )}

      {selected && (
        <div className="mt-2 space-y-2 pl-7">
          <div className="grid grid-cols-3 gap-2">
            <input
              type="time"
              value={stop.time ?? ''}
              onChange={(e) => update({ time: e.target.value || undefined })}
              className={field}
            />
            <select
              value={stop.transport ?? ''}
              title={isFirst ? '从住处/出发地过来的交通方式' : '从上一站过来的交通方式'}
              onChange={(e) => update({ transport: (e.target.value || undefined) as Transport | undefined })}
              className={field}
            >
              <option value="">交通方式</option>
              {Object.entries(TRANSPORT_LABELS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
            <input
              type="number"
              min={0}
              placeholder="花费"
              value={stop.cost ?? ''}
              onChange={(e) => update({ cost: e.target.value === '' ? undefined : Number(e.target.value) })}
              className={field}
            />
          </div>
          <textarea
            rows={2}
            placeholder="备注：门票、营业时间、注意事项…"
            value={stop.note ?? ''}
            onChange={(e) => update({ note: e.target.value || undefined })}
            className={`${field} w-full resize-y`}
          />
          <div className="flex items-center gap-1 text-xs text-stone-500">
            <button
              disabled={isFirst}
              onClick={() => moveStop(stop.id, -1)}
              className="rounded px-2 py-1 hover:bg-stone-200 disabled:opacity-30"
            >
              ↑ 上移
            </button>
            <button
              disabled={isLast}
              onClick={() => moveStop(stop.id, 1)}
              className="rounded px-2 py-1 hover:bg-stone-200 disabled:opacity-30"
            >
              ↓ 下移
            </button>
            <span className="flex-1 text-right text-[11px] text-stone-300">
              {stop.lat.toFixed(4)}, {stop.lng.toFixed(4)}
            </span>
            <button onClick={() => removeStop(stop.id)} className="rounded px-2 py-1 text-red-500 hover:bg-red-50">
              删除
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
