import { loadEnv } from '../config'
import { eventHandlers } from '../domain/event-handlers'
loadEnv()

import { createLogger } from '../shared/logger'

const logger = createLogger('handlers-service')

for (const handler of eventHandlers) {
  handler.start()
}

logger.info('Event handlers started', { count: eventHandlers.length })
