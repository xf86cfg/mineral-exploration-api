import { Db } from 'mongodb'

export async function up(_db: Db) {}

export async function down() {
  throw new Error('No down migrations supported')
}
