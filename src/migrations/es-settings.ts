import { EventStore } from '../shared/database/events'

import * as path from 'path'
import { config } from '../config'

const migrationsDir = path.resolve(__dirname, 'es-migrations')

export = {
  mongodb: {
    url: config.mongoUri,
    databaseName: EventStore,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  changelogCollectionName: 'changelog',
  migrationsDir,
}
