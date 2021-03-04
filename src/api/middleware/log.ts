import * as express from 'express'
import { createLogger } from '../../shared/logger'

const logger = createLogger('api-request')

export function logMiddleware(
  req: express.Request,
  _res: express.Response,
  next: express.NextFunction
) {
  logger.info('Request', {
    url: req.url,
    method: req.method,
    query: req.query,
    body: req.body,
  })

  next()
}
