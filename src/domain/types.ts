export type ReadingCommand = {
  readerId: string
  latitude: number
  longitude: number
  metadata: any
}

export type ReadingEvent = {
  readerId: string
  latitude: number
  longitude: number
  metadata: any
}

export type TimeSeriesReading = {
  readerId: string
  latitude: number
  longitude: number
  metadata: any
  version: number
  timestamp: Date
}
