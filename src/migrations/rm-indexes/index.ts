import { Db } from 'mongodb'

import { DbIndexEnsureFunc } from '../types'
import { ensureInvalidTimeSeriesIndexes } from './invalid-time-series'
import { ensureTimeSeriesIndexes } from './time-series'

export function ensureModelsIndexes(): DbIndexEnsureFunc {
  return ensureBusinessModelsIndexes
}

async function ensureBusinessModelsIndexes(db: Db) {
  await Promise.all([
    ensureInvalidTimeSeriesIndexes(db),
    ensureTimeSeriesIndexes(db),
  ])
}
