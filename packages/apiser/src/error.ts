import { Context, HttpError, Next } from 'koa'
import pino from 'pino'

import config from './config'

const logger = pino(config.logger)

export async function res(ctx: Context, next: Next) {
  try {
    await next()
    if (ctx.response.status === 404 && !ctx.response.body) ctx.throw(404)
  } catch (err) {
    ctx.app.emit('error', err, ctx)

    ctx.type = 'application/json'

    if (err instanceof HttpError) {
      ctx.status = typeof err.status === 'number' ? err.status : 500
      ctx.body = {
        statusCode: ctx.status,
        code: err.name,
        message: err.expose ? err.message : undefined
      }
    } else if (err instanceof Error) {
      ctx.status = 500
      ctx.body = {
        statusCode: ctx.status,
        code: err.name
      }
    }
  }
}

export function on(err: unknown) {
  if (!(err instanceof HttpError) || err.status >= 500) {
    logger.error(err)
  }
}
