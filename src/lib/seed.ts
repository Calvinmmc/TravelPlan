import type { Trip } from '../types'
import { withFreshIds } from './id'
import okinawa from '../../research/okinawa/trip.json'

/**
 * 首次打开时的示例行程。
 * 由 /plan-trip 流水线生成（调研数据见 research/okinawa/），重新生成 trip.json 后这里自动更新。
 */
export function demoTrip(): Trip {
  return withFreshIds(okinawa as Trip)
}
