import { CommandHandlerError } from '../shared'
import { createCommandHandler } from '../shared/store/handlers'
import { ReadingCommand, ReadingEvent } from './types'

export const readingCmd = {
  RecordReading: createCommandHandler<ReadingCommand, ReadingEvent>(
    async (cmd: ReadingCommand) => {
      if (
        !(typeof cmd.latitude === 'number' && typeof cmd.longitude === 'number')
      ) {
        throw new CommandHandlerError(
          `Invalid coordinates latitude ${cmd.latitude} longitude ${cmd.longitude} from reader ${cmd.readerId}`
        )
      }

      if (typeof cmd.depth !== 'number') {
        throw new CommandHandlerError(
          `Invalid depth ${cmd.depth} from reader ${cmd.readerId}`
        )
      }

      if (!(typeof cmd.dip === 'number' && cmd.dip >= 0 && cmd.dip <= 180)) {
        throw new CommandHandlerError(
          `Invalid dip ${cmd.dip} from reader ${cmd.readerId}`
        )
      }

      if (
        !(
          typeof cmd.azimuth === 'number' &&
          cmd.azimuth >= 0 &&
          cmd.azimuth <= 360
        )
      ) {
        throw new CommandHandlerError(
          `Invalid azimuth ${cmd.azimuth} from reader ${cmd.readerId}`
        )
      }

      return {
        readerId: cmd.readerId,
        latitude: cmd.latitude,
        longitude: cmd.longitude,
        depth: cmd.depth,
        dip: cmd.dip,
        azimuth: cmd.azimuth,
      }
    }
  ),
}
