import { Timestamp } from 'mongodb'

export type Bookmark<TPosition = Timestamp> = {
  get: () => Promise<TPosition>
  set: (bookmark: TPosition) => Promise<void>
}

export type BookmarkName = string
