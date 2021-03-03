import { Timestamp } from 'mongodb'

export type Command = {
  aggregateId: string
  type: string
}

export type Aggregate = {
  aggregateId: string
  version: number
}
export type ESEvent = {
  type: string
  aggregateId: string
}

export type StoredESEvent<T extends ESEvent> = {
  aggregateId: string
  position: Timestamp // To guarantee unique incremental ID in MongoDB cluster
  event: T // Wrapped event
  version: number
  timestamp: Date
} & T
