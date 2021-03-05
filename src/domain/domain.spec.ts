import { resetTestDb } from '../test-helpers'
import { readingCmd } from './command-handlers'
import { expect } from 'chai'

describe('Handlers tests', async () => {
  before(async () => {
    await resetTestDb()
  })

  it('Will ensure command handler produces events', async () => {
    const actual1 = await readingCmd.RecordReading({
      readerId: 'reader-1',
      latitude: 12.345678,
      longitude: 23.456789,
      depth: 1,
      dip: 1,
      azimuth: 1,
    })
    expect(actual1).to.be.deep.equal({ version: 1 })

    const actual2 = await readingCmd.RecordReading({
      readerId: 'reader-1',
      latitude: 12.345678,
      longitude: 23.456789,
      depth: 1,
      dip: 1,
      azimuth: 1,
    })
    expect(actual2).to.be.deep.equal({ version: 2 })

    const actual3 = await readingCmd.RecordReading({
      readerId: 'reader-2',
      latitude: 12.345678,
      longitude: 23.456789,
      depth: 1,
      dip: 1,
      azimuth: 1,
    })
    expect(actual3).to.be.deep.equal({ version: 1 })
  })
})
