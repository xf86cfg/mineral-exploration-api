import * as express from 'express'
import { createLogger } from '../../shared/logger'
import { CommandHandlerError } from '../../shared'

const logger = createLogger('express-error-handler')

export async function errorMiddleware(
  ex: any,
  _req: express.Request,
  res: express.Response,
  _next: express.NextFunction
) {
  const status = ex.statusCode || ex.status
  if (isClientError(status)) {
    logger.info('Client error', { error: ex })
    return res.status(status).send({ message: ex.message })
  }

  if (ex instanceof CommandHandlerError) {
    logger.warn('Command handler error', { error: ex })
    return res.status(400).json({ message: ex.message })
  }

  logger.err('Unhandled error', { error: ex })
  return res.status(status || 500).send({ message: 'Internal server error' })
}
function isClientError(httpStatusCode: number): boolean {
  return httpStatusCode >= 400 && httpStatusCode < 500
}
