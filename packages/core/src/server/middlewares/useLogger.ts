import { randomUUID } from 'node:crypto'

import { createLogger } from 'core/logger'
import { serverError } from 'core/server/server.error'

import type { Context, Middleware } from 'koa'
import type { Logger } from 'pino'

const log = createLogger('http')

const asReq = (req: Context['request']) => ({
  method: req.method,
  url: req.url,
  version: req.headers?.['accept-version'],
  hostname: req.hostname,
  remoteAddress: req?.ip,
  remotePort: req?.socket?.remotePort
})

const asRes = (res: Context['response']) => ({
  statusCode: res.status
})

export const useLogger: Middleware = async (ctx, next) => {
  const startTime = process.hrtime.bigint()
  const reqId = randomUUID()
  let error: any

  ctx.log = log
  log.child({ reqId, req: asReq(ctx.request) }).info(undefined)

  await next()
    .then(() => {
      if (ctx.response.status === 404 && !ctx.response.body) ctx.throw(serverError('invalidRequest'))
    })
    .catch(err => {
      error = err
      ctx.app.emit('error', err, ctx)
    })
    .finally(() => {
      const endTime = process.hrtime.bigint()
      const responseTime = Number(endTime - startTime) / 1e6
      const resLog = log.child({ reqId, res: asRes(ctx.response), responseTime })
      const status = error ? (error.isBoom ? error.output.statusCode : error.status || 500) : ctx.response.status || 404

      if (status >= 200 && status < 300) resLog.info(undefined)
      if (status >= 300 && status < 500) resLog.warn(error?.message)
      if (status >= 500) resLog.error(error)
    })
}

declare module 'koa' {
  interface ExtendableContext {
    log: Logger
  }
}
