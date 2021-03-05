import { ensureESIndexes } from './es-indexes'
import * as path from 'path'
import { database, up } from 'migrate-mongo'
import { DbIndexEnsureFunc } from './types'
import { createLogger } from '../shared/logger'
import { ensureModelsIndexes } from './rm-indexes'

export async function migrate() {
  await run(
    'event-stores',
    path.resolve(__dirname, 'es-settings.js'),
    ensureESIndexes()
  )
  await run(
    'read-models',
    path.resolve(__dirname, 'rm-settings.js'),
    ensureModelsIndexes()
  )
}
async function run(
  name: string,
  configFile: string,
  ensure: DbIndexEnsureFunc
) {
  const logger = createLogger(`migrations-${name}`)

  const cfg: any = global
  cfg.options = {
    file: configFile,
  }
  logger.info('Connecting...')
  const { db, client } = await database.connect()
  logger.info('Migrating...')
  try {
    const applied = await up(db, client)
    logger.info({ applied }, `Successfully migrated ${name}`)
    await ensure(db)
    logger.info('Successfully ensured indexes')
  } catch (ex) {
    logger.err({ ex }, 'Failed to migrate')
  }
}
