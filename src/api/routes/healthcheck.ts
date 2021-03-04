import { Request, Response, Router } from 'express'
import { v4 as uuid } from 'uuid'

const router = Router()

router.get('/', async (_req: Request, res: Response) => {
  return res.send({
    response: 'OK',
    uuid: uuid(),
  })
})

export default router
