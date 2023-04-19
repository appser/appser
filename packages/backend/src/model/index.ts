import EventEmitter from 'node:events'

import db from 'backend/db'
import { createLogger } from 'backend/logger'
import { modelError } from 'backend/model/model.error'
import { z } from 'zod'

import { Column } from './column'

import type { Columns, field } from './config'
import type { ResolveFieldSchema } from './field'
import type { Dataset } from 'backend/db'
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

    this.setup()
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

    return this.#dbConfig?.table as keyof Dataset
  }

  get query() {
    return db(this.tableName as T extends keyof Dataset ? T : never).model()
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

  parseInserts(originInserts: unknown) {
    if (Array.isArray(originInserts)) {
      this.state.insert = originInserts.map(record => this.parseInsert(record))

      return this.state.insert
    }
    else if (typeof originInserts === 'object' && originInserts !== null) {
      this.state.insert = this.parseInsert(originInserts as Record<string, unknown>)

      return this.state.insert
    }
    else {
      throw modelError('invalidInsertType')
    }
  }

  parseUpdate(originUpdate: unknown) {
    if (typeof originUpdate === 'object' && originUpdate !== null) {
      // Don't use `this.schema.partial().parse` here, because the values of originUpdate may be as a function that render by the knex,
      // use `this.schema.partial().parse` in the incoming request to validate the request body.

      this.state.update = originUpdate

      return this.state.update
    }
    else {
      throw modelError('invalidUpdateType')
    }
  }

  transformResponse(data: unknown) {
    if (Array.isArray(data)) {
      this.state.response = data.map(record => this.preRecordResponse(record))

      return this.state.response
    }
    else if (typeof data === 'object' && data !== null) {
      this.state.response = this.preRecordResponse(data as Record<string, unknown>)

      return this.state.response
    }
    else {
      return data
    }
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

  private parseInsert(data: Record<string, unknown>): ResolveModel<C> {
    // parser can remove additional properties and set default value
    const parser = this.schema.safeParse(data)

    if (!parser.success) throw modelError('validateFail', parser.error.formErrors)

    const ret = parser.data as any

    // Fix:
    // https://github.com/knex/knex/issues/5430
    // https://github.com/knex/knex/issues/5320
    Object.entries(this.columns).forEach(([name, column]) => {
      if (column.config.field === 'custom' && name in ret && ret[name]) {
        ret[name] = JSON.stringify(ret[name])
      }
    })

    return ret
  }

  /** for respond */
  private preRecordResponse(record: Record<string, unknown>) {
    if (typeof record !== 'object' || record === null) {
      return record
    }

    Object.entries(record).forEach(([name, value]) => {
      const field = this.columns[name]?.field

      if (field) {
        Object.defineProperty(record, name, {
          value: field.onGet(value) ?? value,
          enumerable: true,
          writable: true
        })
      }
    })

    return record
  }

  private get knex() {
    if (!this.#dbConfig?.db) throw new Error('model db without knex')

    return this.#dbConfig.db
  }

  private setup() {
    this.on('startQuery', queryBuilder => {
      log.debug('startQuery')
      this.#queryBuilder = queryBuilder
      this.prepareQuery()
    })
      .on('preInsert', originInserts => {
        this.parseInserts(originInserts)
      })
      .on('preUpdate', originUpdate => {
        this.parseUpdate(originUpdate)
      })
      // .on('insert', () => {})
      // .on('update', () => {})
      .on('preRespond', originResponse => {
        this.transformResponse(originResponse)
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

  private prepareQuery() {
    // Object.values(this.columns).forEach(column => column.field.onQuery())

    return this
  }
}

type ResolveModelSchema<T extends Columns> = ZodObject<{
  [K in keyof T]-?: T[K] extends { field: infer F extends keyof typeof field; isRequired?: infer R; schema?: infer S }
    ? R extends true
      ? S extends ZodSchema ? S : ResolveFieldSchema<typeof field[F]['schema']>
      : ZodOptional<S extends ZodSchema ? S : ResolveFieldSchema<typeof field[F]['schema']>>
    : ZodUnknown
}>

type ResolveModel<T extends Columns> = z.infer<ResolveModelSchema<T>>

type ColumnNames<T extends Columns> = Extract<keyof T, string>

type EventName =
  | 'startQuery'
  | 'preInsert'
  | 'insert'
  | 'preUpdate'
  | 'update'
  | 'delete'
  | 'preRespond'
  | 'respond'
  | 'endQuery'

type EventArgs<T extends Columns, E extends EventName> = E extends 'startQuery'
  ? [queryBuilder: Knex.QueryBuilder]
  : E extends 'preInsert'
    ? [unknown]
    : E extends 'insert'
      ? [ResolveModel<T> | ResolveModel<T>[]]
      : E extends 'preUpdate'
        ? [unknown]
        : E extends 'update'
          ? [NonNullable<State<T>['update']>] // The type of update will be string, function etc..
          : E extends 'delete'
            ? []
            : E extends 'preRespond'
              ? [unknown]
              : E extends 'respond'
                ? [unknown]
                : E extends 'endQuery'
                  ? []
                  : never
