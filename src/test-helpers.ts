import { Db, MongoClient, MongoClientOptions } from 'mongodb'
import { config } from './config'
import { migrate } from './migrations'
import { TEST_MONGO_DB } from './shared/database/utils'

const connectionOptions: MongoClientOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ignoreUndefined: true,
  w: 'majority',
  j: true,
  readPreference: 'primary',
  readConcern: { level: 'majority' },
}

let reset = false
let cached: Db

export async function resetTestDb() {
  if (config.appEnv !== 'test') {
    throw new Error('Cannot reset test db as running not in test environment')
  }

  const client = await MongoClient.connect(config.mongoUri, connectionOptions)
  const db = client.db(TEST_MONGO_DB)

  if (!reset) {
    reset = true
    await db.dropDatabase()
  }

  cached = db
  await dropAllTestCollections()
  await migrate()
}

async function dropAllTestCollections() {
  const collections = await cached.collections()
  const collectionNames = collections.map(c => c.collectionName)
  const queries = collectionNames.map(n => clearOrRecreateCollection(cached, n))
  await Promise.all(queries)
}

async function clearOrRecreateCollection(db: Db, collectionName: string) {
  const collection = db.collection(collectionName)
  const isCapped = await collection.isCapped()
  if (isCapped) {
    const options = await collection.options()
    await collection.drop()
    return db.createCollection(collectionName, {
      capped: true,
      size: options.size,
      max: options.max,
    })
  }
  return collection.deleteMany({})
}
