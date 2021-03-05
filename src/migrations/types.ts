import { Db } from 'mongodb'

export type DbIndexEnsureFunc = (db: Db) => Promise<void>
