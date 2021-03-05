import { loadEnv } from '../config'
import { readModelPopulators } from '../domain/event-handlers'
loadEnv()

import { createLogger } from '../shared/logger'

const logger = createLogger('handlers-service')

for (const populator of readModelPopulators) {
  populator.start()
}

logger.info('Event handlers started', { count: readModelPopulators.length })
