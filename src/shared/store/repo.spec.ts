import { expect } from 'chai'
import { resetTestDb } from '../../test-helpers'
import {
  createStoreWriter,
  createStoreReader,
  createStoreBookmark,
} from './repo'

type Event = {
  aggregateId: string
  type: string
  payload: any
}

const tests: Event[] = [
  {
    aggregateId: 'instrument-1',
    type: 'stream-1',
    payload: {
      data: 'data-1',
    },
  },
  {
    aggregateId: 'instrument-1',
    type: 'stream-2',
    payload: {
      data: 'data-2',
    },
  },
]

describe('Repo tests', async () => {
  before(async () => {
    await resetTestDb()
  })

  const eventStore = 'repoEventStore'

  it('Will ensure repo writer persists events', async () => {
    const writer = createStoreWriter(eventStore)

    for (let i = 0; i < tests.length; i++) {
      const ev = tests[i]
      const { version, event } = await writer.append(i, ev)

      expect({ version, event }).to.be.deep.equal({
        version: i + 1,
        event: ev,
      })
    }
  })

  it('Will ensure repo reader reads persisted events', async () => {
    const reader = createStoreReader(eventStore)
    const events = reader.get('event-1')

    for await (const { version, event } of events) {
      const ev = tests[version - 1]
      expect({ event }).to.be.deep.equal({
        event: ev,
      })
    }
  })

  it('Will ensure repo reader reads last event', async () => {
    const reader = createStoreReader(eventStore)
    const actual = await reader.getLast('instrument-1')
    const ev = tests[tests.length - 1]

    expect({ version: actual?.version, event: actual?.event }).to.be.deep.equal(
      {
        version: tests.length,
        event: ev,
      }
    )
  })

  it('Will ensure repo reader reads events from empty bookmark', async () => {
    const bookmark = createStoreBookmark(eventStore, 'test-bookmark')
    const position = await bookmark.get()
    const reader = createStoreReader(eventStore)
    const events = reader.getFromPosition(position)

    for await (const { version, event } of events) {
      const ev = tests[version - 1]
      expect({ event }).to.be.deep.equal({
        event: ev,
      })
    }
  })
})
