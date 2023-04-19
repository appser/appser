import { createLogger } from 'backend/logger'
import { modelError } from 'backend/model/model.error'

import type { OnlyRequired } from '@appser/shared'
import type { Schema, z } from 'zod'

const log = createLogger('model:field')

export const types = [
  'smallint',
  'bigint',
  'text',
  'boolean',
  'timestamp', // store as time with zone type in PostgreSQL.
  'jsonb'
  // 'geography',
  // 'virtual', // generated column
  // 'stored' // generated column
] as const

interface Config {
  baseType: typeof types[number]
  optionSchema?: Schema
}

interface Event<Value, Options> {
  onGet?: (data: Value, options: Options) => unknown
  // onModelUpdate?: (fieldValue: unknown, options: Options) => unknown
  // onQuery?: (context: FieldContext, options: Options) => void
}

export default class Field {
  static store: { [K in string]?: Parameters<typeof Field.define> } = {}

  baseType
  optionSchema?: Schema

  #options: unknown
  #schema
  #event

  constructor(public name: string) {
    const defined = Field.store[name]

    if (!defined) throw new Error(`Field type '${name}' not stored, define it first.`)

    const [,config, schema, event] = defined

    this.baseType = config.baseType
    this.optionSchema = config.optionSchema
    this.#schema = schema
    this.#event = event
  }

  static define<C extends Config, S extends Schema>(
    name: string,
    config: C,
    schema: S | ((o: ResolveFieldOptions<C>) => S),
    event?: Event<z.infer<S>, ResolveFieldOptions<C>>
  ) {
    if (!types.includes(config.baseType)) throw new Error(`Invalid field base type: ${config.baseType}.`)

    Object.assign(Field.store, {
      [name]: [name, config, schema, event]
    })

    log.debug('defined field type', name)

    return {
      field: name,
      schema,
      optionSchema: config.optionSchema as C['optionSchema']
    }
  }

  options(opt: unknown = {}) {
    if (this.optionSchema?.safeParse(opt).success === false) {
      throw modelError('invalidFieldOptions')
    }

    this.#options = opt

    return this
  }

  get schema() {
    return typeof this.#schema === 'function' ? this.#schema(this.#options) : this.#schema
  }

  onGet(origin: unknown) {
    return this.#event?.onGet?.(origin as never, this.#options)
  }
}

export interface Fields {}

export type ResolveFieldSchema<S> = S extends Schema
  ? S
  : S extends (o: infer O) => Schema
    ? ReturnType<S>
    : unknown

type ResolveFieldOptions<C> = C extends OnlyRequired<Config, 'optionSchema'> ? z.infer<C['optionSchema']> : unknown
