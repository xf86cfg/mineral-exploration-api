import { EventStore } from '../shared/database/events'
import {
  timeSeriesInvalidReadings,
  timeSeriesReadings,
} from '../shared/database/read-models'
import { createEventHandler } from '../shared/store/handlers'
import { createStoreReader } from '../shared/store/repo'
import { ReadingEvent } from './types'

export const timeSeriesPopulator = createEventHandler('time-series')
export const invalidTimeSeriesPopulator = createEventHandler(
  'invalid-time-series'
)

timeSeriesPopulator.register(async ({ event, timestamp, version }) => {
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

invalidTimeSeriesPopulator.register(
  async ({ event, timestamp, version, position }) => {
    if (!event.invalid) {
      return
    }

    const numberOfEvents = 5
    const maxAzimuthDrift = 5
    const maxDipDrift = 3

    const reader = createStoreReader<ReadingEvent>(EventStore)

    // It is safe to read stream here since read concern boundary is isolated by absolute position
    const previousEvents = await reader.getBeforePosition(
      event.readerId,
      position,
      numberOfEvents
    )

    if (previousEvents?.length !== numberOfEvents) {
      return
    }

    const lastEventAzimuth =
      previousEvents[previousEvents.length - 1].event.azimuth

    const isAzimuthWithinConstrain =
      Math.abs(event.azimuth - lastEventAzimuth) <= maxAzimuthDrift

    const avgDip =
      previousEvents.reduce((acc, curr) => (acc += curr.event.dip), 0) /
      previousEvents.length

    const isDipWithinConstrain = Math.abs(avgDip - event.dip) <= maxDipDrift

    if (isAzimuthWithinConstrain && isDipWithinConstrain) {
      await timeSeriesInvalidReadings(callback =>
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
    }
  }
)

export const readModelPopulators = [
  timeSeriesPopulator,
  invalidTimeSeriesPopulator,
]
