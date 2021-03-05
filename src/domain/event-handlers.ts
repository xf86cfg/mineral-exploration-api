import { createEventHandler } from '../shared/store/handlers'
import { ESEvent, StoredESEvent } from '../shared/store/types'

export const timeSeriesHandler = createEventHandler('time-series')

timeSeriesHandler.register(async (event: StoredESEvent<ESEvent>) => {
  console.log('handled: ', event)
})

export const eventHandlers = [timeSeriesHandler]
