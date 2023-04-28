import EventEmitter from 'node:events'

import db from 'backend/db'
import { createLogger } from 'backend/logger'
import { modelError } from 'backend/model/model.error'
import { z } from 'zod'

import { Column, CustomColumn } from './column'
import { Validator } from './validator'

import type { SomeColumn } from './column'
import type { ResolveFieldSchema } from './field'
import type { fields } from './fields'
import type { Columns } from './schemas/column.config.schema'
import type { Knex } from 'knex'
import type { ZodObject, ZodOptional, ZodSchema, ZodUnknown } from 'zod'

const log = createLogger('model')

interface DBConfig {
  db?: Knex
  table?: string
  index?: Parameters<Knex.TableBuilder['index']>
  primary?: string[]
}

export class Model<T = unknown, C extends Columns = Columns> extends EventEmitter {
  static store: Record<string, Omit<Model, 'tableName'> & { tableName: string }> = {}

  schema
  columns

  #dbConfig: DBConfig = {}

  constructor(columns: C) {
    super()

    this.columns = this.compileColumns(columns)
    this.schema = this.compileSchema()
    this.init()
  }

  static define<T extends string, C extends Columns = Columns>(tableName: T, column: C) {
    const model = new Model<T, C>(column).connect({ table: tableName })

    Object.assign(Model.store, { [tableName]: model })

    log.debug('defined model', tableName)

    return model
  }

  static get(name: string) {
    const model = Model.store[name]

    if (!model) throw modelError('notFound')

    return model
  }

  get tableName() {
    if (!this.#dbConfig?.table) throw modelError('missingTableWName')

    return this.#dbConfig?.table as keyof Models
  }

  get dbSchemaBuilder() {
    if (!this.#dbConfig?.db) throw new Error('model db without knex')

    return this.#dbConfig.db.schema
  }

  get query() {
    return db(this.tableName as T extends keyof Models ? T : never).model()
  }

  get validator() {
    return new Validator(this as any)
  }

  connect({ db: client = db, table: tableName }: DBConfig) {
    this.#dbConfig = { db: client, table: tableName }

    return this
  }

  index(...args: Parameters<Knex.TableBuilder['index']>) {
    this.#dbConfig.index = args

    return this
  }

  primary(keys: ColumnNames<C> | ColumnNames<C>[]) {
    this.#dbConfig.primary = Array.isArray(keys) ? keys.map(key => String(key)) : [String(keys)]

    return this
  }

  getColumn(columnName: string) {
    if (!this.columns[columnName]) throw modelError('columnNotFound', { columnName })

    return this.columns[columnName]
  }

  createTable() {
    const schemaBuilder = this.dbSchemaBuilder.createTable(this.tableName, t => this.toTableBuilder(t))

    this.emit('createTable', schemaBuilder)

    return schemaBuilder
  }

  dropTable() {
    return this.dbSchemaBuilder.dropTableIfExists(this.tableName)
  }

  private init() {
    this
      .on('query', queryBuilder => {
        log.debug('start query')
        Object.values(this.columns).forEach(column => column instanceof Column && column.field.emit('query', queryBuilder))
      })
  }

  private compileSchema() {
    return Object.entries(this.columns).reduce((acc, [name, column]) => {
      return acc.extend({
        [name]: column.schema
      })
    }, z.object({})) as ResolveModelSchema<C>
  }

  private compileColumns(columns: Columns) {
    return Object.entries(columns).reduce<Record<string, SomeColumn>>((acc, [name, columnObj]) => {
      if (columnObj instanceof CustomColumn) {
        columnObj.name = name
        acc[name] = columnObj
      } else {
        const column = new Column(name, columnObj)
        acc[name] = column
      }

      return acc
    }, {})
  }

  private toTableBuilder(t: Knex.TableBuilder) {
    Object.values(this.columns).forEach(column => column.toColumnBuilder?.(t))

    if (this.#dbConfig.index) t.index(...this.#dbConfig.index)
    if (this.#dbConfig.primary) t.primary(this.#dbConfig.primary)

    return t
  }
}

type ResolveModelSchema<T extends Columns> = ZodObject<{
  [K in keyof T]-?: T[K] extends { field: infer F extends keyof typeof fields; isRequired?: infer R; schema?: infer S }
    ? R extends true
      ? S extends ZodSchema ? S : ResolveFieldSchema<typeof fields[F]['schema']>
      : ZodOptional<S extends ZodSchema ? S : ResolveFieldSchema<typeof fields[F]['schema']>>
    : T[K] extends CustomColumn ? T[K]['schema'] : ZodUnknown
}>

type ColumnNames<T extends Columns> = Extract<keyof T, string>

export declare interface Model<T, C> {
  on<E extends EventName>(eventName: E, listener: (...args: EventArgs<C, E>) => void): this
  emit<E extends EventName>(eventName: E, ...args: EventArgs<C, E>): boolean
}

type EventName =
  | 'createTable'
  | 'query'
  // | 'insert'
  // | 'update'
  // | 'delete'
  // | 'respond'

type EventArgs<T extends Columns, E extends EventName> =
E extends 'createTable' ? [Knex.SchemaBuilder] :
  E extends 'query' ? [Knex.QueryBuilder] :
    never

export interface Models {}

declare module 'knex/types/tables' {
  interface Tables extends Models {}
}
