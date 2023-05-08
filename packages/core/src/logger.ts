import pino from 'pino'

const debug = require('debug')

const logger = pino({
  /*
  transport:
    process.env.NODE_ENV === 'production'
      ? undefined
      : {
          target: 'pino-pretty',
          options: {
            ignore: 'hostname,time,v'
          }
        }
        */
})

export function createLogger(name: string) {
  const log = logger.child({ name })

  log.debug = debug('appser').extend(name)

  return log
}
