import Ajv from 'ajv'
import { JSONSchema7Definition } from 'json-schema'
import Koa, { Middleware } from 'koa'
import bodyParser from 'koa-bodyparser'

const ajv = new Ajv({
  coerceTypes: true
})

const debug = require('debug')('apiser:request')

export interface RequestSchema {
  headers?: JSONSchema7Definition
  params?: JSONSchema7Definition
  querystring?: JSONSchema7Definition
  body?: JSONSchema7Definition
}

export function parseQuerystring(app: Koa) {
  require('koa-qs')(app, 'extended', {
    allowDots: true
  })
}

export const parseBody = bodyParser({
  enableTypes: ['json', 'form', 'text'],
  extendTypes: {
    text: ['text/xml', 'application/xml']
  }
})

export function validate(schema: RequestSchema): Middleware {
  return async function (ctx, next) {
    const errorText = (dataVar: string) => {
      return ajv.errorsText(undefined, {
        dataVar
      })
    }

    if (schema?.headers && !ajv.validate(schema.headers, ctx.headers)) {
      debug('Validation failed (headers):', ctx.headers, schema.headers)

      ctx.throw(400, errorText('headers'))
    }

    if (schema?.params && !ajv.validate(schema.params, ctx.params)) {
      debug('Validation failed (params):', ctx.params, schema.params)

      ctx.throw(400, errorText('params'))
    }

    if (schema?.querystring && !ajv.validate(schema.querystring, ctx.query)) {
      debug('Validation failed (querystring):', ctx.query, schema.querystring)

      ctx.throw(400, errorText('querystring'))
    }

    if (schema?.body && !ajv.validate(schema.body, ctx.request.body)) {
      debug('Validation failed (body):', ctx.request.body, schema.body)

      ctx.throw(400, errorText('body'))
    }

    return next()
  }
}
