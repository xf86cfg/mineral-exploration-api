export type ReadingCommand = Reading

export type ReadingEvent = Reading

export type TimeSeriesReading = Reading & {
  version: number
  timestamp: Date
}

export type Reading = {
  readerId: string
  latitude: number
  longitude: number
  depth: number
  dip: number
  azimuth: number
  invalid?: boolean
}
