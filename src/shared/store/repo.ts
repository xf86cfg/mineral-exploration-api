import { Timestamp } from 'bson'
import { bookmarks, getCollectionReference } from '../database/events'

import { ESEvent, StoredESEvent } from './types'
import { MongoError } from 'mongodb'

export function createStoreReader<TEvt extends ESEvent>(storeName: string) {
  const collection = getCollectionReference(storeName)
  async function* getFromPosition(position: Timestamp) {
    const events = await collection.then(c =>
      c.find<StoredESEvent<TEvt>>(
        {
          position: {
            $gt: position,
          },
        },
        {
          sort: { position: 1 },
        }
      )
    )
    yield* events
  }

  async function getBeforePosition(
    readerId: string,
    position: Timestamp,
    limit: number
  ) {
    if (!readerId) {
      return
    }

    const events = await collection.then(c =>
      c
        .find<StoredESEvent<TEvt>>(
          {
            readerId,
            position: {
              $lt: position,
            },
          },
          {
            sort: { position: 1 },
            limit,
          }
        )
        .toArray()
    )
    return events
  }

  const idCollection = getCollectionReference(storeName)
  async function* get(readerId: string) {
    if (!readerId) {
      return
    }

    const events = await idCollection.then(c =>
      c.find<StoredESEvent<TEvt>>(
        {
          readerId,
        },
        {
          sort: { version: 1 },
        }
      )
    )
    yield* events
  }

  async function getLast(readerId: string) {
    if (!readerId) {
      return
    }

    const event = await idCollection.then(c =>
      c.findOne<StoredESEvent<TEvt>>(
        {
          readerId,
        },
        {
          sort: { version: -1 },
        }
      )
    )
    return event ?? undefined
  }

  return {
    get, // SG: This is exposed for testing purposes only
    getLast,
    getFromPosition,
    getBeforePosition,
  }
}

export function createStoreWriter<TEvt extends ESEvent>(storeName: string) {
  const collection = getCollectionReference(storeName)

  async function append(version: number, event: TEvt) {
    const tentativeEvent = {
      readerId: event.readerId,
      version: ++version,
      event,
      position: new Timestamp(0, 0),
      timestamp: new Date(Date.now()),
    } as StoredESEvent<TEvt>

    try {
      await collection.then(c => c.insertOne(tentativeEvent))
      return tentativeEvent
    } catch (error) {
      // SG: Write conflict on unique key
      if (error instanceof MongoError && error.code === 11000) {
        throw new VersionConflict(JSON.stringify({ error }))
      }
      throw error
    }
  }
  return {
    append,
  }
}

export function createStoreBookmark(name: string) {
  const get = async (): Promise<Timestamp> => {
    const position = await bookmarks(collection =>
      collection.findOne({ key: name })
    )
    if (!position) {
      return new Timestamp(0, 0)
    }

    return position.bookmark
  }

  const set = async (position: Timestamp) => {
    await bookmarks(collection =>
      collection.updateOne(
        { key: name },
        { $set: { bookmark: position }, $currentDate: { lastUpdate: true } },
        { upsert: true }
      )
    )
  }

  return { get, set }
}

export class EventStoreError extends Error {}

export class VersionConflict extends EventStoreError {}
