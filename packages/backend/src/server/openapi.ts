import { isPlainObject } from 'lodash'
import isEmpty from 'lodash/isEmpty'
import zodToJsonSchema from 'zod-to-json-schema'

import { errorSchema } from './errorHandler'

import type { RequestSchema, ResponseSchema } from './controller'
import type { OpenAPIPartialOperation } from './router'
import type { OpenAPIV3 } from 'openapi-types'
import type { Schema } from 'zod'

type ParameterIn = 'query' | 'header' | 'path' | 'cookie'

const doc: OpenAPIV3.Document = {
  openapi: '3.0.3',
  info: {
    version: '1.0.0',
    title: 'appser'
  },
  paths: {},
  components: {
    schemas: {},
    responses: {
      error: {
        description: 'Error Response',
        content: {
          'application/json': {
            schema: toOpenAPISchema(errorSchema)
          }
        }
      }
    },
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  }
}

export default doc

export function resolveOperation(info: OpenAPIPartialOperation, request?: RequestSchema, response?: ResponseSchema): OpenAPIV3.OperationObject {
  const operationId = info.operationId
  const operation: OpenAPIV3.OperationObject = {
    ...info,
    responses: resolveResponse(operationId, response)
  }

  if (request) {
    const { header, params, query, body } = request
    const parameters: OpenAPIV3.ParameterObject[] = []

    if (header) parameters.push(...resolveParameters('header', header))
    if (params) parameters.push(...resolveParameters('path', params))
    if (query) parameters.push(...resolveParameters('query', query))
    if (body) operation.requestBody = resolveRequestBody(body)
    if (parameters.length > 0) operation.parameters = parameters
  }

  return operation
}

function resolveParameters(inside: ParameterIn, zodSchema: Schema): OpenAPIV3.ParameterObject[] {
  const schema = toOpenAPISchema(zodSchema)

  if (!(('type' in schema) && schema.type === 'object' && 'properties' in schema && schema.properties)) throw new Error('schema must be an object')

  return Object.entries(schema.properties).reduce<OpenAPIV3.ParameterObject[]>((acc, [name, property]) => {
    // Omit accept,content-type,authorization, see https://swagger.io/specification/#parameter-object
    if (inside === 'header' && ['accept', 'content-type', 'authorization'].includes(name.toLocaleLowerCase())) {
      return acc
    }

    const required = schema.required?.includes(name) ?? false

    acc.push({
      name,
      in: inside,
      required,
      schema: property as OpenAPIV3.SchemaObject
    })

    return acc
  }, [])
}

function resolveRequestBody(zodSchema?: Schema): OpenAPIV3.RequestBodyObject | undefined {
  if (!zodSchema) return

  return {
    content: {
      'application/json': {
        schema: toOpenAPISchema(zodSchema)
      }
    },
    required: true
  }
}

function resolveResponse(operationId: string, response?: ResponseSchema): OpenAPIV3.ResponsesObject {
  if (!response || isEmpty(response)) {
    return {
      200: { description: 'Default Response' }
    }
  }

  const description = {
    200: { description: 'Default Response' },
    201: { description: 'Created' },
    204: { description: 'No Content' }
  }

  const obj = Object.entries(response).reduce<OpenAPIV3.ResponsesObject>((acc, [_statusCode, schema]) => {
    const statusCode = String(_statusCode) as unknown as keyof ResponseSchema

    acc[statusCode] = {
      description: description[statusCode]?.description ?? 'Custom Response'
    }

    if (schema !== null) {
      Object.assign(acc[statusCode], {
        content: {
          'application/json': {
            schema: toOpenAPISchema(schema, true)
          }
        }
      })
    }

    return acc
  }, {})

  obj['4XX'] = {
    $ref: '#/components/responses/error'
  }

  return obj
}

/**
 * Make the property value a required field in the response
 */
export function toOpenAPISchema(zodSchema: Schema, shouldMoveDefaultToRequired = false) {
  const schema = zodToJsonSchema(zodSchema, {
    target: 'openApi3',
    $refStrategy: 'none'
  }) as OpenAPIV3.SchemaObject

  const moveDefaultToRequired = (s: OpenAPIV3.SchemaObject) => {
    if (s.type === 'array' && isPlainObject(s.items)) {
      moveDefaultToRequired(s.items as OpenAPIV3.SchemaObject)
    } else if (s.type === 'object' && s.properties) {
      Object.entries(s.properties).forEach(([key, value]) => {
        if ('properties' in value) moveDefaultToRequired(value)
        if ('items' in value) moveDefaultToRequired(value.items as OpenAPIV3.SchemaObject)

        if ('default' in value) {
          delete value.default
          s.required = s.required?.concat(key) ?? [key]
        }
      })
    }

    return s
  }

  if (shouldMoveDefaultToRequired) return moveDefaultToRequired(schema)

  return schema
}

// The swagger standard does not accept the url param with ':'
// so '/user/:id' is not valid.
// This function converts the url in a swagger compliant url string
// => '/user/{id}'
// custom verbs at the end of a url are okay => /user::watch but should be rendered as /user:watch in swagger
export function formatParamUrl(str: string) {
  const COLON = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_'

  let i, char
  let state = 'skip'
  let path = ''
  let param = ''
  let level = 0
  // count for regex if no param exist
  let regexp = 0

  for (i = 0; i < str.length; i++) {
    char = str[i]

    switch (state) {
      case 'colon': {
        // we only accept a-zA-Z0-9_ in param
        if (COLON.includes(char)) {
          param += char
        }
        else if (char === '(') {
          state = 'regexp'
          level++
        }
        else {
          // end
          state = 'skip'
          path += `{${param}}`
          path += char
          param = ''
        }

        break
      }

      case 'regexp': {
        if (char === '(') {
          level++
        }
        else if (char === ')') {
          level--
        }

        // we end if the level reach zero
        if (level === 0) {
          state = 'skip'

          if (param === '') {
            regexp++
            param = `regexp${String(regexp)}`
          }

          path += `{${param}}`
          param = ''
        }

        break
      }

      default: {
        // we check if we need to change state
        if (char === ':' && str[i + 1] === ':') {
          // double colon -> single colon
          path += char
          // skip one more
          i++
        }
        else if (char === ':') {
          // single colon -> state colon
          state = 'colon'
        }
        else if (char === '(') {
          state = 'regexp'
          level++
        }
        else if (char === '*') {
          // * -> wildcard
          // should be exist once only
          path += '{wildcard}'
        }
        else {
          path += char
        }
      }
    }
  }

  // clean up
  if (state === 'colon' && param !== '') {
    path += `{${param}}`
  }

  return path
}
