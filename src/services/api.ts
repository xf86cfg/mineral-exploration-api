import { loadEnv } from '../config'
loadEnv()

import app from '../api/create-server'
import { createLogger } from '../shared/logger'

const logger = createLogger('api-service')

const port = Number(process.env.PORT || 4000)

app.listen(port, () => {
  logger.info('Server started', { port })
})
