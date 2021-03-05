export type ReadingCommand = {
  aggregateId: string
  latitude: number
  longitude: number
  metadata: any
}

export type ReadingEvent = {
  aggregateId: string
  latitude: number
  longitude: number
  metadata: any
}

export type TimeSeriesReading = {
  aggregateId: string
  latitude: number
  longitude: number
  metadata: any
  version: number
  timestamp: Date
}
