import { Db } from 'mongodb'

import { DbIndexEnsureFunc } from '../types'
import { EventStore, BookmarkStore } from '../../shared/database/events'

export function ensureESIndexes(): DbIndexEnsureFunc {
  return async (db: Db) => {
    const collection = db.collection(EventStore)

    await collection.createIndex(
      { position: 1 },
      { name: 'es-position', unique: true }
    )

    await collection.createIndex(
      { aggregateId: 1, version: 1 },
      { name: 'es-aggregate-version', unique: true }
    )

    // Create index for bookmarks in database
    await db
      .collection(BookmarkStore)
      .createIndex({ key: 1 }, { name: 'bookmark-key', unique: true })
  }
}
