import Ajv from 'ajv/dist/jtd'
import { SomeJTDSchemaType } from 'ajv/dist/types/jtd-schema'
import { Middleware } from 'koa'

export interface ResponseSchema {
  [statusCode: number]: SomeJTDSchemaType
}

export const ajv = new Ajv()
const debug = require('debug')('apiser:response')

// more than 10x compared with JSON.stringify.
export function serialize(jtd: ResponseSchema): Middleware {
  return function (ctx, next) {
    const { status } = ctx.response

    if (jtd && jtd[status] && ctx.body && typeof ctx.body === 'object') {
      try {
        const serialize = ajv.compileSerializer(jtd[status])
        ctx.body = serialize(ctx.body)
      } catch (error) {
        debug('Serialization failed:', error)
      }
    }

    return next()
  }
}
