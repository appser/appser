import { Generated } from './generated'

interface ClientConfig {
  endpoint: string
  token?: string
  withCredentials?: boolean
}

export default class Client extends Generated {
  constructor(config: ClientConfig) {
    super({
      BASE: config.endpoint,
      TOKEN: config.token,
      WITH_CREDENTIALS: config.withCredentials
    })
  }
}

export * from './generated'
