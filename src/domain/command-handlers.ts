import { CommandHandlerError } from '../shared'
import { createCommandHandler } from '../shared/store/handlers'
import { ReadingCommand, ReadingEvent } from './types'

export const readingCmd = {
  RecordReading: createCommandHandler<ReadingCommand, ReadingEvent>(
    async (cmd: ReadingCommand) => {
      if (!(cmd.latitude && cmd.longitude)) {
        throw new CommandHandlerError(`Invalid coordinates at reading: ${cmd}`)
      }
      return {
        aggregateId: cmd.aggregateId,
        type: 'ReadingRecorded',
        latitude: cmd.latitude,
        longitude: cmd.longitude,
        metadata: cmd.metadata,
      }
    }
  ),
}
