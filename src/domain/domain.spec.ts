import { resetTestDb } from '../test-helpers'
import { readingCmd } from './command-handlers'
import { expect } from 'chai'
import { timeSeriesHandler } from './event-handlers'

describe('Handlers tests', async () => {
  before(async () => {
    await resetTestDb()
  })

  it('Will ensure command handler produces events', async () => {
    const actual1 = await readingCmd.RecordReading({
      aggregateId: 'reader-1',
      type: 'RecordReading',
      latitude: 12.345678,
      longitude: 23.456789,
      metadata: 'data-1',
    })
    expect(actual1).to.be.deep.equal({ version: 1 })

    const actual2 = await readingCmd.RecordReading({
      aggregateId: 'reader-1',
      type: 'RecordReading',
      latitude: 12.345678,
      longitude: 23.456789,
      metadata: 'data-2',
    })
    expect(actual2).to.be.deep.equal({ version: 2 })

    const actual3 = await readingCmd.RecordReading({
      aggregateId: 'reader-2',
      type: 'RecordReading',
      latitude: 12.345678,
      longitude: 23.456789,
      metadata: 'data-3',
    })
    expect(actual3).to.be.deep.equal({ version: 1 })
  })

  it('Will ensure event handler handles events', async () => {
    timeSeriesHandler.startOnce()
  })
})
