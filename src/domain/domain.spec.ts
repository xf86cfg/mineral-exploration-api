import { resetTestDb } from '../test-helpers'
import { readingCmd } from './command-handlers'

describe.only('Repo tests', async () => {
  before(async () => {
    await resetTestDb()
  })

  it('Will ensure reading events are produced upon command basic validation', async () => {
    await readingCmd.RecordReading({
      aggregateId: 'reader-1',
      type: 'RecordReading',
      latitude: 12.345678,
      longitude: 23.456789,
      metadata: 'data-1',
    })

    await readingCmd.RecordReading({
      aggregateId: 'reader-1',
      type: 'RecordReading',
      latitude: 12.345678,
      longitude: 23.456789,
      metadata: 'data-2',
    })

    await readingCmd.RecordReading({
      aggregateId: 'reader-2',
      type: 'RecordReading',
      latitude: 12.345678,
      longitude: 23.456789,
      metadata: 'data-3',
    })
  })
})
