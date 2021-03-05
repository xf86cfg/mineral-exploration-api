import { Timestamp } from 'mongodb'

export type Command = {
  readerId: string
}

export type ESEvent = {
  readerId: string
}

export type StoredESEvent<T extends ESEvent> = {
  readerId: string
  position: Timestamp // To guarantee unique incremental ID in MongoDB cluster
  event: T // Wrapped event
  version: number
  timestamp: Date
} & T
