import { HttpStatusCode } from '@appser/common'
import { type Context } from 'koa'
import { ZodError, z } from 'zod'
import { fromZodError } from 'zod-validation-error'

export const errorSchema = z.object({
  error: z.object({
    statusCode: z.number().int(),
    code: z.string(),
    message: z.string().optional(),
    detail: z.any().optional()
  })
})

export default function errorHandler(err: any, ctx: Context) {
  let statusCode, code, message, detail

  if (err instanceof ZodError) {
    statusCode = HttpStatusCode.BadRequest
    code = 'ValidateError'
    message = fromZodError(err).toString()
  }
  else {
    statusCode = typeof err.status === 'number' ? err.status : 500
    code = statusCode === 500 || !err.code ? 'InternalError' : err.code
    message = err?.expose ? err.message : undefined
    detail = err?.expose ? err.detail : undefined
  }

  ctx.type = 'application/json'
  ctx.status = statusCode
  ctx.body = errorSchema.parse({
    error: {
      code,
      statusCode,
      message,
      detail
    }
  })
}
