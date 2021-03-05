import { Router } from 'express'
import healthcheckRouter from './healthcheck'
import readingsRouter from './readings'

const router = Router()

router.use('/healthcheck', healthcheckRouter)
router.use('/readings', readingsRouter)

export default router
