import EventEmitter from 'node:events'

import { createLogger } from 'backend/logger'
import { modelError } from 'backend/model/model.error'

import type { Schema, z } from 'zod'

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

interface Config<T, D, S, O extends Schema> {
  type: T
  dataType: D
  schema?: S | ((o: z.infer<O>) => S)
  optionSchema?: O
  options?: z.infer<O>
}

export class Field<T extends string, D extends DataType, S extends Schema, O extends Schema> extends EventEmitter {
  static store: { [T in string]?: any } = {}

  config

  constructor(config: Config<T, D, S, O>) {
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

  static create(type: string): Field<any, DataType, any, any> {
    const field = this.store[type]

    if (!field) {
      throw new Error(`Field type '${type}' not stored, define it first.`)
    }

    return Object.create(Object.getPrototypeOf(field))
  }

  optionSchema<_O extends O>(schema: _O) {
    this.config.optionSchema = schema

    return this as unknown as Field<T, D, S, _O>
  }

  schema<_S extends S>(schema: _S | ((o: z.infer<O>) => _S)) {
    this.config.schema = schema

    return this as unknown as Field<T, D, _S, O>
  }

  options(opt: unknown = {}) {
    const parser = this.config.optionSchema?.safeParse(opt)

    if (parser && !parser.success) {
      throw modelError('invalidFieldOptions')
    }

    this.config.options = parser?.data

    return this
  }

  getSchema() {
    const { schema } = this.config

    if (!schema) throw new Error('Schema not defined')

    return typeof schema === 'function' ? schema(this.config.options = {}) : schema
  }
}

export declare interface Field<T extends string, D extends DataType, S extends Schema, O extends Schema> {
  on<E extends EventName>(eventName: E, listener: (...args: EventArgs<E, S, O>) => void): this
  emit<E extends EventName>(eventName: E, ...args: EventArgs<E, S, O>): boolean
}

type EventName =
  | 'response'
  // | 'other'

type EventArgs< E extends EventName, S extends Schema, O extends Schema> =
 E extends 'response' ? [z.infer<S>, z.infer<O>] :
   never

export type ResolveFieldSchema<S> = S extends Schema
  ? S
  : S extends (o: infer O) => Schema
    ? ReturnType<S>
    : unknown
