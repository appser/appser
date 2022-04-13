import http from 'http'
import pino from 'pino'

import app from './app'
import config from './config'

const { port, host, logger: loggerConfig } = config

const logger = pino({
  ...loggerConfig,
  mixin() {
    return {
      type: 'server'
    }
  }
})

const server = http.createServer(app.callback())

server.listen(port, host)
server.on('error', onError)
server.on('listening', onListening)

function onError(error: NodeJS.ErrnoException) {
  if (error.syscall !== 'listen') throw error

  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`

  switch (error.code) {
    case 'EACCES':
      logger.error(`${bind} requires elevated privileges`)
      process.exit(1)
      break
    case 'EADDRINUSE':
      logger.error(`${bind} is already in use`)
      process.exit(1)
      break
    default:
      throw error
  }
}

function onListening() {
  const addr = server.address()
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `${addr?.address}:${addr?.port}`
  logger.warn(`server listening at ${bind} in ${process.env.NODE_ENV ?? 'development'}`)
}

process.on('SIGTERM', signal => {
  logger.warn(`Process ${process.pid} received a ${signal} signal`)
  process.exit(0)
})

export default server
