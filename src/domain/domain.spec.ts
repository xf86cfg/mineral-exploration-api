import { resetTestDb } from '../test-helpers'
import { readingCmd } from './command-handlers'
import { expect } from 'chai'
import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import { ReadingCommand } from './types'

chai.use(chaiAsPromised)

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

    await expect(
      readingCmd.RecordReading({
        readerId: 'reader-3',
        latitude: 12.345678,
        longitude: 23.456789,
        depth: 1,
        dip: 200,
        azimuth: 1,
      })
    ).to.eventually.be.rejected

    await expect(
      readingCmd.RecordReading({
        readerId: 'reader-3',
        latitude: 12.345678,
        longitude: 23.456789,
        depth: 1,
        dip: 1,
        azimuth: 400,
      })
    ).to.eventually.be.rejected

    await expect(
      readingCmd.RecordReading({
        readerId: 'reader-3',
        depth: 1,
        dip: 1,
        azimuth: 1,
      } as ReadingCommand)
    ).to.eventually.be.rejected
  })
})
