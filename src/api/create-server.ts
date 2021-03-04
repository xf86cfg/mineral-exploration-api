import * as express from 'express'
import { errorMiddleware, logMiddleware } from './middleware'
import baseRouter from './routes'
var cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())
app.use(logMiddleware)
app.use('/api', baseRouter)
app.use(errorMiddleware)

export default app
