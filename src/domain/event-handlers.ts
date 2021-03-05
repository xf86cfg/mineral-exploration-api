import { timeSeriesReadings } from '../shared/database/read-models'
import { createEventHandler } from '../shared/store/handlers'

export const timeSeriesHandler = createEventHandler('time-series')

timeSeriesHandler.register(async ({ event, timestamp, version }) => {
  await timeSeriesReadings(callback =>
    callback.insertOne({
      aggregateId: event.aggregateId,
      version,
      timestamp,
      latitude: event.latitude,
      longitude: event.longitude,
      metadata: event.metadata,
    })
  )
})

export const eventHandlers = [timeSeriesHandler]
