import { Request, Response, Router } from 'express'
import { asyncHandler } from '../middleware'
import { Reading } from '../../domain/types'
import { readingCmd } from '../../domain/command-handlers'
import {
  timeSeriesInvalidReadings,
  timeSeriesReadings,
} from '../../shared/database/read-models'

const router = Router()

type ReadingBody = Reading

router.post(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const request = req.body as ReadingBody
    if (!request.readerId) {
      return res.status(403).send()
    }

    const { version } = await readingCmd.RecordReading({
      readerId: request.readerId,
      latitude: request.latitude,
      longitude: request.longitude,
      dip: request.dip,
      depth: request.depth,
      azimuth: request.azimuth,
      invalid: request.invalid,
    })

    return res.status(201).send({ version })
  })
)

router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const request = req.body as ReadingBody
    if (!(request.latitude && request.longitude)) {
      return res.status(400).send()
    }

    const readings = await timeSeriesReadings(
      callback =>
        callback
          .find({
            latitude: request.latitude,
            longitude: request.longitude,
          })
          .project({
            _id: 0,
          })
          .toArray() // SG: Deferred iterator with pagination has to be implemented here for production phase.
    )

    return res.status(201).send({ readings })
  })
)

router.get(
  '/invalid',
  asyncHandler(async (req: Request, res: Response) => {
    const request = req.body as ReadingBody
    if (!(request.latitude && request.longitude)) {
      return res.status(400).send()
    }

    const invalidReadings = await timeSeriesInvalidReadings(
      callback =>
        callback
          .find({
            latitude: request.latitude,
            longitude: request.longitude,
          })
          .project({
            _id: 0,
          })
          .toArray() // SG: Deferred iterator with pagination has to be implemented here for production phase.
    )

    return res.status(201).send({ invalidReadings })
  })
)

export default router
