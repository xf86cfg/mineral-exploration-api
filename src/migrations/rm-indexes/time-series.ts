import { Db, IndexSpecification } from 'mongodb'
import { createIndexes } from '../utils'

export async function ensureTimeSeriesIndexes(db: Db) {
  await createIndexes(db, 'timeSeriesReadings', timeSeriesIndexes)
}

const timeSeriesIndexes: IndexSpecification[] = [
  {
    name: 'readerId-version',
    key: {
      readerId: 1,
      version: 1,
    },
    unique: true,
  },
  {
    name: 'latitude-longitude',
    key: {
      latitude: 1,
      longitude: 1,
    },
    background: true,
  },
]
