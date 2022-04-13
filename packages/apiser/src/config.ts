import { Options } from 'pino-http'

interface Config {
  port: number
  host: string
  rootDir: string
  logger: Options
}

const defaultConfig: Config = {
  port: 3000,
  host: '0.0.0.0',
  rootDir: '.',
  logger: {
    timestamp: () => `,"time":"${new Date(Date.now()).toISOString()}"`
  }
}

export default defaultConfig
