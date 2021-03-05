import * as path from 'path'
import { config } from '../config'
import { ReadModelsStore } from '../shared/database/read-models'

const migrationsDir = path.resolve(__dirname, 'rm-migrations')

export = {
  mongodb: {
    url: config.mongoUri,
    databaseName: ReadModelsStore,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  changelogCollectionName: 'changelog',
  migrationsDir,
}
