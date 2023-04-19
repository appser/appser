import compose from 'koa-compose'

import type { Middleware, RouterParamContext } from '@koa/router'
import type { Middleware as KoaMiddleware } from 'koa'
import type { Schema, ZodObject, ZodTypeAny, z } from 'zod'

 type ObjectSchema = ZodObject<Record<string, ZodTypeAny>>

export interface RequestSchema {
  header?: ObjectSchema
  params?: ObjectSchema
  query?: ObjectSchema
  body?: ObjectSchema
}
export interface ResponseSchema {
  200?: Schema | null
  /** Created */
  201?: Schema | null
  /** No Content */
  204?: null
}

interface ControllerConfig<StateS, HeaderS, ParamsS, QueryS, BodyS, ResponseS> {
  state?: StateS
  header?: HeaderS
  params?: ParamsS
  query?: QueryS
  body?: BodyS
  response?: ResponseS
}

export class Controller<
  StateS extends StateST,
  HeaderS extends ObjectSchema,
  ParamsS extends ObjectSchema,
  QueryS extends ObjectSchema,
  BodyS extends ObjectSchema,
  ResponseS extends ResponseSchema
> {
  constructor(
    public baseMiddleware: IRouterMiddleware<
      StateS,
      z.infer<HeaderS>,
      z.infer<ParamsS>,
      z.infer<QueryS>,
      z.infer<BodyS>,
      InferResponseType<ResponseS>
    >,
    public config: ControllerConfig<StateS, HeaderS, ParamsS, QueryS, BodyS, ResponseS> = {}
  ) {
    this.config = config
    this.baseMiddleware = baseMiddleware
  }

  get requestSchema(): RequestSchema | undefined {
    if (!this.config) return
    const { header, params, query, body } = this.config
    const schema: RequestSchema = {}

    if (header) schema.header = header
    if (params) schema.params = params
    if (query) schema.query = query
    if (body) schema.body = body
    if (Object.keys(schema).length === 0) return

    return schema
  }

  get responseSchema(): ResponseSchema | undefined {
    return this.config.response
  }

  get middleware() {
    const stack = [this.useStateValidator(), this.baseMiddleware].filter(Boolean) as Middleware[]

    return compose(stack)
  }

  private useStateValidator(): Middleware | undefined {
    const requiredStates = this.config.state

    if (!requiredStates) return

    return function (ctx, next) {
      const exists = requiredStates.every(key => ctx.state[key])

      if (!exists) throw new TypeError(`missing state: ${requiredStates.join(', ')}`)

      return next()
    }
  }
}

type StateST = readonly (keyof State)[]

type IRouterMiddleware<StateT, HeaderT, ParamsT, QueryT, BodyT, ResponseT> = KoaMiddleware<
  // TODO fix: if state isn't defined in the schema, will return {}
  StateT extends NonNullable<StateST> ? Pick<State, StateT[number]> : never,
  Omit<RouterParamContext, 'params'> & {
    header: HeaderT
    params: ParamsT
    query: QueryT
    request: {
      query: QueryT
      body: BodyT
    }
  },
  ResponseT
>

type InferResponseType<T extends ResponseSchema> = T[200] extends Schema
  ? z.infer<T[200]>
  : T[200] extends null
    ? null
    : T[201] extends Schema
      ? z.infer<T[201]>
      : T[201] extends null
        ? null
        : T[204] extends null
          ? T[204]
          : unknown

export interface State {}

export type SomeController = Controller<any, any, any, any, any, any>

declare module 'koa' {
  // enhanced by body-parser
  interface Request {
    body?: unknown
    rawBody: string
  }
}
