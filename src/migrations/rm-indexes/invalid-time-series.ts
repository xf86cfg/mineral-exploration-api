import { Db, IndexSpecification } from 'mongodb'
import { createIndexes } from '../utils'

export async function ensureInvalidTimeSeriesIndexes(db: Db) {
  await createIndexes(db, 'timeSeriesInvalidReadings', invalidTimeSeriesIndexes)
}

const invalidTimeSeriesIndexes: IndexSpecification[] = [
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
