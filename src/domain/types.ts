export type ReadingCommand = {
  aggregateId: string
  type: 'RecordReading'
  latitude: number
  longitude: number
  metadata: any
}

export type ReadingEvent = {
  aggregateId: string
  type: 'ReadingRecorded'
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
