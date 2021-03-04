import { connect, MongoClientOptions, Timestamp, Collection } from 'mongodb'
import { config } from '../../config'
import { ESEvent, StoredESEvent } from '../store/types'
import { getDbName } from './utils'

export const BookmarkStore = 'bookmarkStore'
export const EventStore = 'eventStore'

type BookmarkDocument = {
  key: string
  bookmark: Timestamp
}

const connectionOptions: MongoClientOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ignoreUndefined: true,
  w: 'majority',
  j: true,
  readPreference: 'primary',
  readConcern: { level: 'majority' },
}

const repoDb = connect(config.mongoUri, connectionOptions).then(client =>
  client.db(getDbName(EventStore))
)

export async function bookmarks<T>(
  callback: (collection: Collection<BookmarkDocument>) => T
) {
  return repoDb
    .then(db => db.collection<BookmarkDocument>(BookmarkStore))
    .then(callback)
}

export async function getCollectionReference<T extends ESEvent>(name: string) {
  return repoDb.then(db => db.collection<StoredESEvent<T>>(name))
}
