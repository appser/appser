import EventEmitter from 'node:events'

import { createLogger } from 'backend/logger'
import { modelError } from 'backend/model/errors'
import { cloneDeep } from 'lodash'
import { z } from 'zod'

import type { Knex } from 'knex'
import type { Schema } from 'zod'

const log = createLogger('model:field')

export const dataTypes = [
  'smallint',
  'bigint',
  'text',
  'boolean',
  'timestamp', // store as time with zone type in PostgreSQL.
  'jsonb'
  // 'geography',
] as const

export type DataType = typeof dataTypes[number]

interface Config<S, O extends Schema> {
  type: string
  dataType: DataType
  schema?: S | ((o: z.infer<O>) => S)
  optionSchema?: O
}

export class Field<S extends Schema, O extends Schema> extends EventEmitter {
  static store: { [T in string]?: Field<any, any> } = {}

  options?: z.infer<O>

  config

  constructor(config: Config< S, O>) {
    super()
    this.config = config
  }

  static define<T extends string, D extends DataType>(type: T, dataType: D) {
    const field = new Field({
      type,
      dataType
    })
    Object.assign(this.store, { [type]: field })

    log.debug('defined field type', type)

    return field
  }

  static create(type: string) {
    const field = this.store[type]

    if (!field) {
      throw new Error(`Field type '${type}' not stored, define it first.`)
    }

    return cloneDeep(field)
  }

  get type() {
    return this.config.type
  }

  get dataType() {
    return this.config.dataType
  }

  get schema() {
    const { schema } = this.config

    if (!schema) throw new Error('Schema not defined')

    return typeof schema === 'function' ? schema(this.options) : schema
  }

  get optionSchema() {
    return this.config.optionSchema ?? z.undefined()
  }

  useOptionSchema<_O extends O>(schema: _O) {
    this.config.optionSchema = schema

    return this as unknown as Field<S, _O>
  }

  useSchema<_S extends S>(schema: _S | ((o: z.infer<O>) => _S)) {
    this.config.schema = schema

    return this as unknown as Field<_S, O>
  }

  withOptions(opt: unknown = {}) {
    const parser = this.config.optionSchema?.safeParse(opt)

    if (parser && !parser.success) {
      throw modelError('invalidFieldOptions')
    }

    this.options = parser?.data ?? opt

    return this
  }
}

export declare interface Field<S extends Schema, O extends Schema> {
  on<E extends EventName>(eventName: E, listener: (...args: EventArgs<E, S, O>) => void): this
  emit<E extends EventName>(eventName: E, ...args: EventArgs<E, S, O>): boolean
}

type EventName =
  | 'response'
  | 'query'
  // | 'other'

type EventArgs< E extends EventName, S extends Schema, O extends Schema> =
 E extends 'response' ? [z.infer<S>, z.infer<O>] :
   E extends 'query' ? [Knex.QueryBuilder] :
     never

export type ResolveFieldSchema<S> = S extends Schema
  ? S
  : S extends (o: infer O) => Schema
    ? ReturnType<S>
    : unknown
