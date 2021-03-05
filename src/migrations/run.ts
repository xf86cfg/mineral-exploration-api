import { migrate } from '.'
import { createLogger } from '../shared/logger'

const log = createLogger('migrator')

migrate()
  .then(() => process.exit(0))
  .catch(ex => {
    log.err(ex, 'Failed to run database migrations')
  })
