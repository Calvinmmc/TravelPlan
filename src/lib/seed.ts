import type { Trip } from '../types'
import { withFreshIds } from './id'
import okinawa from '../../research/okinawa/trips/5d-main-island-miyako.json'

/**
 * 首次打开时放进「我的行程」的示例。
 * 来自 /plan-trip 生成的冲绳方案，重新生成后这里自动更新。
 */
export function demoTrip(): Trip {
  return withFreshIds(okinawa as Trip)
}
