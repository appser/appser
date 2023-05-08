import config from './config'
import { checkEnv } from './config/env'
import * as db from './db'
import server from './server'

export async function start() {
  checkEnv()

  await db.connect()
  await server.listen(config.server.port)
}

export { server, config }
