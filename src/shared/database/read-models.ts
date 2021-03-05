import { Collection, connect, MongoClientOptions } from 'mongodb'
import { config } from '../../config'
import { TimeSeriesReading } from '../../domain/types'
import { getDbName } from './utils'

export const ReadModelsStore = 'readModelsStore'

const connectionOptions: MongoClientOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ignoreUndefined: true,
}

const rmModelsDb = connect(config.mongoUri, connectionOptions).then(client =>
  client.db(getDbName(ReadModelsStore))
)

async function getReadModelReference<T>(name: string) {
  return rmModelsDb.then(db => db.collection<T>(name))
}

type Callback<T, U> = (collection: Collection<T>) => U

export const timeSeriesReadings = <T>(
  callback: Callback<TimeSeriesReading, T>
) => getReadModelReference<any>('timeSeriesReadings').then(callback)

export const timeSeriesInvalidReadings = <T>(
  callback: Callback<TimeSeriesReading, T>
) => getReadModelReference<any>('timeSeriesInvalidReadings').then(callback)
