import * as dotenv from 'dotenv'

export function loadEnv() {
  return dotenv.config() && true
}

let loaded = false

function getEnvVariable<T extends any>(variable: string): T {
  if (!loaded) {
    loaded = loadEnv()
  }
  return process.env[variable] as T
}

type Config = {
  appEnv: string
  appPort: number
  mongoUri: string
}

const defaultConfig: Readonly<Config> = {
  appEnv: 'dev',
  appPort: 4000,
  mongoUri: 'mongodb://127.0.0.1:27017',
}

export const config: Readonly<Config> = {
  appEnv: getEnvVariable<string>('appEnv') || defaultConfig.appEnv,
  appPort: getEnvVariable<number>('appPort') || defaultConfig.appPort,
  mongoUri: getEnvVariable<string>('mongoUri') || defaultConfig.mongoUri,
}
