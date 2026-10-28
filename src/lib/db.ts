import Dexie, { type Table } from 'dexie'
import type { Trip } from '../types'

class TravelDB extends Dexie {
  trips!: Table<Trip, string>

  constructor() {
    super('travel-planner')
    this.version(1).stores({ trips: 'id, updatedAt' })
  }
}

export const db = new TravelDB()
