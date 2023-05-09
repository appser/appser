import KoaRouter from '@koa/router'
import { serverError } from 'core/server/server.error'
import compose from 'koa-compose'
import cloneDeep from 'lodash/cloneDeep'
import isEmpty from 'lodash/isEmpty'
import set from 'lodash/set'
import { ZodError } from 'zod'

import { useAccess } from './middlewares/useAccess'
import { useAuth } from './middlewares/useAuth'
import { formatParamUrl, resolveOperation } from './openapi'
import { createLogger } from '../logger'

import type { RequestSchema, ResponseSchema, SomeController } from './controller'
import type { Overwrite } from '@appser/common'
import type { Middleware } from '@koa/router'
import type { OpenAPIV3 } from 'openapi-types'
import type { Schema } from 'zod'

const log = createLogger('router')
const methods = ['get', 'put', 'patch', 'post', 'delete'] as const

interface Layer {
  method: typeof methods[number]
  path: string
  requestSchema?: RequestSchema
  middlewares: Middleware[]
  controllers: SomeController[]
  responseSchema?: ResponseSchema
  openAPIOperation?: OpenAPIPartialOperation
}

export type OpenAPIPartialOperation = {
  tags: string[]
  operationId: string
  summary?: string
  description?: string
  security?: OpenAPIV3.SecurityRequirementObject[]
}

export class Router {
  #stack: Layer[] = []
  #currentLayer?: Layer
  #koaRouter

  constructor() {
    this.#koaRouter = new KoaRouter()
  }

  use(...controllers: Array<SomeController>) {
    this.currentLayer.controllers.push(...controllers)

    return this
  }

  get(path: string) {
    return this.define('get', path)
  }

  post(path: string) {
    return this.define('post', path)
  }

  put(path: string) {
    return this.define('put', path)
  }

  patch(path: string) {
    return this.define('patch', path)
  }

  delete(path: string) {
    return this.define('delete', path)
  }

  auth(...controllers: Array<SomeController>) {
    this.currentLayer.middlewares.push(useAuth)
    this.use(...controllers)

    return this
  }

  access(...controllers: Array<SomeController>) {
    this.currentLayer.middlewares.push(useAuth, useAccess)
    this.use(...controllers)

    return this
  }

  openapi(operation: Overwrite<OpenAPIPartialOperation, { tags: string }>) {
    const _info = {
      ...operation,
      tags: Array<string>().concat(operation.tags)
    }

    this.currentLayer.openAPIOperation = _info

    return this
  }

  get openAPIPaths() {
    this.saveCurrentLayer()

    return this.#stack.reduce<OpenAPIV3.Document['paths']>((acc, layer) => {
      const { method, path, mergedRequestSchema, lastResponseSchema, openAPIOperation } = this.compileLayer(layer)

      if (!openAPIOperation) return acc

      const operation = resolveOperation(openAPIOperation, mergedRequestSchema, lastResponseSchema)

      return set(acc, `${formatParamUrl(path)}.${method}`, operation)
    }, {})
  }

  get routes() {
    this.saveCurrentLayer()

    this.#stack.forEach(layer => {
      const { method, path, middlewares } = this.compileLayer(layer)

      if (middlewares.length === 0) throw new Error(`no middlewares defined in path ${path}`)

      this.#koaRouter[method](path, ...middlewares)

      log.debug(
        `defined route [%s] %s, %s middleware`,
        method.toUpperCase(),
        path,
        middlewares.length
      )
    })

    return compose([
      this.#koaRouter.routes(),
      this.#koaRouter.allowedMethods({
        throw: true
      })
    ])
  }

  private get currentLayer() {
    if (!this.#currentLayer) throw new Error('use get, post, put, patch or delete before use')

    return this.#currentLayer
  }

  private saveCurrentLayer() {
    // store previous layer
    if (this.#currentLayer) this.#stack.push(cloneDeep(this.#currentLayer))

    return this
  }

  private define(method: typeof methods[number], path: string) {
    this.saveCurrentLayer()

    // reset layer
    this.#currentLayer = {
      method,
      path,
      middlewares: [],
      controllers: []
    }

    return this
  }

  private compileLayer(layer: Layer) {
    const controller = layer.controllers.reduce(
      (acc, controller) => {
        const { requestSchema, middleware, responseSchema } = controller

        requestSchema && acc.requestSchemas.push(requestSchema)
        middleware && acc.middlewares.push(middleware)
        // always use the last response, can be undefined
        acc.responseSchemas.push(responseSchema)

        return acc
      },
      {
        requestSchemas: [] as RequestSchema[],
        middlewares: layer.middlewares,
        responseSchemas: [] as Array<ResponseSchema | undefined>
      }
    )
    const mergedRequestSchema = this.mergeRequestSchema(controller.requestSchemas)
    const lastResponseSchema = controller.responseSchemas.pop()

    return {
      path: layer.path,
      method: layer.method,
      mergedRequestSchema,
      lastResponseSchema,
      openAPIOperation: layer.openAPIOperation,
      middlewares: [
        this.useRequestValidator(mergedRequestSchema),
        ...controller.middlewares,
        this.useResponseSerializer(lastResponseSchema)
      ].filter(Boolean) as Middleware[]
    }
  }

  private mergeRequestSchema(requestSchemas: RequestSchema[]) {
    return requestSchemas.reduce((acc, requestSchema) => {
      const { query, body, header, params } = requestSchema

      if (query) acc.query = acc.query ? acc.query.merge(query) : query
      if (body) acc.body = acc.body ? acc.body.merge(body) : body
      if (header) acc.header = acc.header ? acc.header.merge(header) : header
      if (params) acc.params = acc.params ? acc.params.merge(params) : params

      return acc
    }, {})
  }

  private useRequestValidator(requestSchema?: RequestSchema): Middleware | undefined {
    if (!requestSchema) return
    const { query, body, header, params } = requestSchema

    return function (ctx, next) {
      try {
        // all the values of ctx.query are parsed as string
        // if (query) ctx.coercedQuery = query.parse(ctx.query)
        if (query) ctx.query = query.parse(ctx.query)
        if (body) ctx.request.body = body.parse(ctx.request.body)
        if (header) ctx.headers = header.parse(ctx.headers)
        if (params) ctx.params = params.parse(ctx.params)
      } catch (error) {
        return ctx.throw(serverError('invalidParameter', error instanceof ZodError ? error.formErrors : error))
      }

      return next()
    }
  }

  private useResponseSerializer(responseSchema?: ResponseSchema): Middleware | undefined {
    if (!responseSchema || isEmpty(responseSchema)) return

    // const serializer = fastJson(responseSchema as never)
    // TODO: serialize zod schema like fast-json-stringify
    const serializers = Object.entries(responseSchema).reduce<Record<string, Schema | null>>(
      (acc, [statusCode, schema]) => {
        // when statusCode is 204, schema is undefined
        if (schema !== undefined) {
          acc[statusCode] = schema === null ? null : schema
        }

        return acc
      },
      {}
    )

    return function (ctx, next) {
      const { status } = ctx.response

      if (String(status) in serializers) {
        const serializer = serializers[String(status)]

        try {
          ctx.body = serializer === null ? null : serializer.parse(ctx.body)
        } catch (error) {
          ctx.log.warn(error)
        }
      }
      else {
        ctx.log.warn(`no serializer for status code ${status}`)
      }

      return next()
    }
  }
}
