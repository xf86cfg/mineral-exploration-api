import { Db, IndexSpecification, Collection } from 'mongodb'
import { createLogger } from '../shared/logger'

const logger = createLogger('migrator-indexes')

export async function createCollectionIndexes(
  collection: Collection,
  indexes: IndexSpecification[]
) {
  try {
    await collection.createIndexes(indexes)
  } catch (ex) {
    logger.err('Error creating collection indexes', { error: ex })
  }
}

export async function createIndexes(
  db: Db,
  collectionName: string,
  indexes: IndexSpecification[]
) {
  try {
    await createCollectionIndexes(db.collection(collectionName), indexes)
  } catch (ex) {
    logger.err('Error creating indexes', { error: ex })
  }
}
