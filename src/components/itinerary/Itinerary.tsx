import type { Trip } from '../../types'
import { useTripStore } from '../../store/useTripStore'
import DayCard from './DayCard'

export default function Itinerary({ trip }: { trip: Trip }) {
  const updateTrip = useTripStore((s) => s.updateTrip)
  const setTripDates = useTripStore((s) => s.setTripDates)

  const stops = trip.days.flatMap((d) => d.stops)
  const totalCost = stops.reduce((sum, s) => sum + (s.cost ?? 0), 0)

  const changeDates = (startDate: string, endDate: string) => {
    if (!startDate || !endDate || endDate < startDate) return
    const dropped = trip.days.filter((d) => (d.date < startDate || d.date > endDate) && d.stops.length > 0)
    if (dropped.length && !confirm(`有 ${dropped.length} 天的地点会被移除，确定修改日期吗？`)) return
    setTripDates(startDate, endDate)
  }

  return (
    <section className="flex w-[440px] shrink-0 flex-col border-r border-stone-200 bg-white">
      <header className="border-b border-stone-100 px-6 pb-4 pt-6">
        <input
          value={trip.name}
          onChange={(e) => updateTrip({ name: e.target.value })}
          className="w-full bg-transparent text-2xl font-bold outline-none"
        />
        <div className="mt-2 flex items-center gap-2 text-sm text-stone-500">
          <input type="date" value={trip.startDate}
            onChange={(e) => changeDates(e.target.value, trip.endDate)}
            className="rounded px-1 hover:bg-stone-100" />
          <span>→</span>
          <input type="date" value={trip.endDate} min={trip.startDate}
            onChange={(e) => changeDates(trip.startDate, e.target.value)}
            className="rounded px-1 hover:bg-stone-100" />
        </div>
        <div className="mt-2 flex gap-4 text-xs text-stone-400">
          <span>{trip.days.length} 天</span>
          <span>{stops.length} 个地点</span>
          {totalCost > 0 && (
            <span>
              预计花费 {trip.currency ?? ''} {totalCost.toLocaleString()}
            </span>
          )}
        </div>
      </header>

      <div className="flex-1 space-y-6 overflow-y-auto px-4 py-4">
        {trip.days.map((day, i) => (
          <DayCard key={day.id} day={day} index={i} />
        ))}
      </div>
    </section>
  )
}
