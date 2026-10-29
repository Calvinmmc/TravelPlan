import type { Trip } from '../types'

export const uid = () => crypto.randomUUID()

/** 复制一份行程并重新生成所有 id（导入文件、载入示例时用，避免与已有行程冲突） */
export function withFreshIds(trip: Trip): Trip {
  const now = Date.now()
  return {
    ...trip,
    id: uid(),
    createdAt: now,
    updatedAt: now,
    days: trip.days.map((d) => ({ ...d, id: uid(), stops: d.stops.map((s) => ({ ...s, id: uid() })) })),
  }
}
