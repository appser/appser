import { type Context } from 'koa'
import { z } from 'zod'

export const errorSchema = z.object({
  error: z.object({
    statusCode: z.number().int(),
    code: z.string(),
    message: z.string().optional(),
    detail: z.any().optional()
  })
})

export default function errorHandler(err: any, ctx: Context) {
  const statusCode = typeof err.status === 'number' ? err.status : 500
  const code = statusCode === 500 || !err.code ? 'InternalError' : err.code
  const message = err?.expose ? err.message : undefined
  const detail = err?.expose ? err.detail : undefined

  ctx.status = statusCode
  ctx.type = 'application/json'
  ctx.body = errorSchema.parse({
    error: {
      code,
      statusCode,
      message,
      detail
    }
  })
}
