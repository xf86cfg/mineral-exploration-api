import { timeSeriesReadings } from '../shared/database/read-models'
import { createEventHandler } from '../shared/store/handlers'

export const timeSeriesHandler = createEventHandler('time-series')

timeSeriesHandler.register(async ({ event, timestamp, version }) => {
  await timeSeriesReadings(callback =>
    callback.insertOne({
      readerId: event.readerId,
      version,
      timestamp,
      latitude: event.latitude,
      longitude: event.longitude,
      depth: event.depth,
      dip: event.dip,
      azimuth: event.azimuth,
    })
  )
})

export const eventHandlers = [timeSeriesHandler]
