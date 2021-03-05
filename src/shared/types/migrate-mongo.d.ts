declare module 'migrate-mongo' {
  import { Db, MongoClient, MongoClientOptions } from 'mongodb'
  export function init(): Promise<void>
  export function create(migrationName: string): Promise<string>
  export function up(db: Db, client: MongoClient): Promise<string[]>
  export function down(db: Db, client: MongoClient): Promise<string[]>
  export interface Status {
    fileName: string
    appliedAt: number
  }
  export function status(db: Db, client: MongoClient): Promise<Status[]>
  export const database: {
    connect(): Promise<{ db: Db; client: MongoClient }>
  }
  export interface Config {
    mongodb: {
      url: string
      databaseName: string
      options: MongoClientOptions
    }
    migrationsDir: string
    changelogCollectionName: string
  }
  export const config: {
    read(): Promise<Config>
  }
}
