import { ReadingEvent } from '../../domain/types'
import { EventStore } from '../database/events'
import { createLogger } from '../logger'
import {
  createStoreBookmark,
  createStoreReader,
  createStoreWriter,
  VersionConflict,
} from './repo'
import { Command, ESEvent, StoredESEvent } from './types'

const MAX_WRITE_ATTEMPTS = 5

export function createCommandHandler<
  TCmd extends Command,
  TEvt extends ESEvent
>(handler: (cmd: TCmd) => Promise<TEvt | void>) {
  const reader = createStoreReader(EventStore)
  const writer = createStoreWriter(EventStore)
  const logger = createLogger(EventStore)

  return async function (cmd: TCmd) {
    let attempt = 0
    // TODO: Backoff mechanism
    while (true) {
      try {
        const lastReading = await reader.getLast(cmd.readerId)
        const event = await handler(cmd)
        if (event) {
          const persisted = await writer.append(
            lastReading?.version ?? 0,
            event
          )
          return { version: persisted.version }
        }
      } catch (error) {
        if (
          error instanceof VersionConflict &&
          attempt++ < MAX_WRITE_ATTEMPTS
        ) {
          logger.err(`VersionConflict`, { ...error, attempt })
          continue
        }
        throw error
      }
    }
  }
}

export function createEventHandler(bookmarkName: string) {
  const reader = createStoreReader(EventStore)
  const bookmark = createStoreBookmark(bookmarkName)
  const logger = createLogger(EventStore)

  let eventHandler: any = undefined
  let processing = false
  let processedEvents = 0
  let cycles = 0

  function register(
    handler: (event: StoredESEvent<ReadingEvent>) => Promise<void>
  ) {
    eventHandler = handler
  }

  async function startOnce() {
    if (processing) {
      logger.warn('Active processing cycle')
      return
    }

    try {
      processing = true
      const position = await bookmark.get()
      const events = reader.getFromPosition(position)

      for await (const ev of events) {
        if (eventHandler) {
          await eventHandler(ev)
          ++processedEvents
          await bookmark.set(ev.position)
        }
      }
      if (cycles++ > 10) {
        logger.info('Handled events', { processedEvents })
        cycles = 0
        processedEvents = 0
      }
    } catch (error) {
      throw error
    } finally {
      processing = false
    }
  }

  const TIMEOUT = 1000
  let BACKOFF_TIMEOUT = TIMEOUT
  async function start() {
    setTimeout(async () => {
      try {
        await startOnce()
        BACKOFF_TIMEOUT = TIMEOUT
      } catch (error) {
        BACKOFF_TIMEOUT *= 2
        logger.err('Failed to handle event', {
          error,
          backoff: BACKOFF_TIMEOUT,
        })
      }
      start()
    }, BACKOFF_TIMEOUT)
  }

  return { start, startOnce, register }
}
