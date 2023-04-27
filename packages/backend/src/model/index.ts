import EventEmitter from 'node:events'

import db from 'backend/db'
import { createLogger } from 'backend/logger'
import { modelError } from 'backend/model/model.error'
import { z } from 'zod'

import { Column } from './column'
import { Validator } from './validator'

import type { ResolveFieldSchema } from './field'
import type { fields } from './fields'
import type { Columns } from './schemas/column.config.schema'
import type { Knex } from 'knex'
import type { ZodObject, ZodOptional, ZodSchema, ZodUnknown } from 'zod'

const log = createLogger('model')

interface ModelConfig {
  index?: Parameters<Knex.TableBuilder['index']>
  primary?: string[]
  sql?: string
}

interface DBConfig {
  table: string
  db?: Knex
}

interface State<T extends Columns> {
  insert?: ResolveModel<T> | ResolveModel<T>[]
  update?: Partial<Record<keyof T, unknown>>
  response?: unknown
}

export declare interface Model<T, C> {
  on<E extends EventName>(eventName: E, listener: (...args: EventArgs<C, E>) => void): this
  emit<E extends EventName>(eventName: E, ...args: EventArgs<C, E>): boolean
}

export class Model<T = unknown, C extends Columns = Columns> extends EventEmitter {
  static store: Record<string, Omit<Model, 'tableName'> & { tableName: string }> = {}

  state: State<C> = {}
  schema
  columns

  #config: ModelConfig = {}

  #dbConfig?: DBConfig
  #queryBuilder?: Knex.QueryBuilder

  constructor(columns: C) {
    super()

    this.columns = this.compileColumns(columns)
    this.schema = this.getSchema()

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
    this.#config.index = args

    return this
  }

  primary(keys: ColumnNames<C> | ColumnNames<C>[]) {
    this.#config.primary = Array.isArray(keys) ? keys.map(key => String(key)) : [String(keys)]

    return this
  }

  sql(sql: string) {
    this.#config.sql = sql

    return this
  }

  getColumn(columnName: string) {
    if (!this.columns[columnName]) throw modelError('columnNotFound', { columnName })

    return this.columns[columnName]
  }

  hasColumn(name: string) {
    return Boolean(this.columns[name])
  }

  getSchema() {
    return Object.entries(this.columns).reduce((acc, [name, column]) => {
      return acc.merge(column.schema)
    }, z.object({})) as ResolveModelSchema<C>
  }

  toTableBuilder(t: Knex.TableBuilder) {
    Object.values(this.columns).forEach(column => column.toColumnBuilder?.(t))

    if (this.#config.index) t.index(...this.#config.index)
    if (this.#config.primary) t.primary(this.#config.primary)

    return t
  }

  createTable() {
    const schemaBuilder = this.knex.schema.createTable(this.tableName, t => this.toTableBuilder(t))

    if (this.#config.sql) {
      schemaBuilder.raw(this.#config.sql)
    }

    return schemaBuilder
  }

  hasTable() {
    return this.knex.schema.hasTable(this.tableName)
  }

  dropTable() {
    return this.knex.schema.dropTableIfExists(this.tableName)
  }

  private get knex() {
    if (!this.#dbConfig?.db) throw new Error('model db without knex')

    return this.#dbConfig.db
  }

  // TODO
  private prepareQuery() {
    return this
  }

  private init() {
    this
      .on('startQuery', queryBuilder => {
        log.debug('startQuery')
        this.#queryBuilder = queryBuilder
        this.prepareQuery()
      })
      .on('endQuery', () => {
        this.#queryBuilder = undefined
        log.debug('endQuery')
      })
  }

  private compileColumns(columns: Columns) {
    return Object.entries(columns).reduce<Record<string, Column>>((acc, [name, columnObj]) => {
      const column = new Column(name, columnObj)

      acc[name] = column

      return acc
    }, {})
  }
}

type ResolveModelSchema<T extends Columns> = ZodObject<{
  [K in keyof T]-?: T[K] extends { field: infer F extends keyof typeof fields; isRequired?: infer R; schema?: infer S }
    ? R extends true
      ? S extends ZodSchema ? S : ResolveFieldSchema<typeof fields[F]['schema']>
      : ZodOptional<S extends ZodSchema ? S : ResolveFieldSchema<typeof fields[F]['schema']>>
    : ZodUnknown
}>

type ResolveModel<T extends Columns> = z.infer<ResolveModelSchema<T>>

type ColumnNames<T extends Columns> = Extract<keyof T, string>

type EventName =
  | 'startQuery'
  // | 'insert'
  // | 'update'
  // | 'delete'
  // | 'respond'
  | 'endQuery'

type EventArgs<T extends Columns, E extends EventName> = E extends 'startQuery'
  ? [queryBuilder: Knex.QueryBuilder]
  : E extends 'insert'
    ? [unknown]
    : E extends 'update'
      ? [unknown, Knex.QueryBuilder? ] // The type of update will be string, function etc..
      : E extends 'delete'
        ? []
        : E extends 'respond'
          ? [unknown]
          : E extends 'endQuery'
            ? []
            : never

export interface Models {}

declare module 'knex/types/tables' {
  interface Tables extends Models {}
}
