import { config } from '../../config'

export const TEST_MONGO_DB = 'tests'

export function getDbName(name: string) {
  return config.appEnv === 'test' ? TEST_MONGO_DB : name
}
