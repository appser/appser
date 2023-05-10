import EventEmitter from 'node:events'

import db from 'core/db'
import { modelError } from 'core/db/model/mode.error'
import { createLogger } from 'core/logger'
import { z } from 'zod'

import { Validator } from './validator'
import { isQuerySelect } from '../helpers/isQuerySelect'

import type { Column } from './column'
import type { Models } from 'core/db/model'
import type { Knex } from 'knex'
import type { ZodObject, ZodUnknown } from 'zod'

const log = createLogger('model')

interface Config {
  knex?: Knex
  tableName?: string
  primary?: string[]
  index?: Parameters<Knex.TableBuilder['index']>
}

export class Model<C extends SomeColumns = SomeColumns, T = unknown> extends EventEmitter {
  static store: Record<string, Omit<Model, 'tableName'> & { tableName: string }> = {}

  schema
  columns

  #config: Config = {}

  constructor(columns: C) {
    super()

    this.columns = this.compileColumns(columns)
    this.schema = this.compileSchema()
    this.init()
  }

  static define<T extends string, C extends SomeColumns>(tableName: T, column: C) {
    const model = new Model<C, T>(column).connect({ tableName })

    Object.assign(Model.store, { [tableName]: model })

    log.debug('defined model', tableName)

    return model
  }

  static get(name: string) {
    const model = Model.store[name]

    if (!model) throw modelError('notFound')

    return model
  }

  static async createTables() {
    return Promise.all(
      Object.values(Model.store)
        .map(model => model.createTable())
    )
  }

  get tableName() {
    if (!this.#config?.tableName) throw modelError('missingTableWName')

    return this.#config?.tableName as keyof Models
  }

  get query() {
    return db(this.tableName as T extends keyof Models ? T : never).model(this)
  }

  get validator() {
    return new Validator(this as any)
  }

  connect({ knex = db, tableName }: Config) {
    this.#config.knex = knex
    this.#config.tableName = tableName

    return this
  }

  index(...args: NonNullable<Config['index']>) {
    this.#config.index = args

    return this
  }

  primary(keys: ColumnNames<C>[]) {
    this.#config.primary = keys

    return this
  }

  getColumn(columnName: string) {
    if (!this.columns[columnName]) throw modelError('columnNotFound', { columnName })

    return this.columns[columnName]
  }

  async createTable() {
    const { knex } = this.#config
    const tableName = this.tableName

    if (!knex) throw new Error('model without knex')
    if (!tableName) throw new Error('model without tableName')

    const shouldDropTable = process.env.NODE_ENV !== 'production' && process.env.DROP_TABLE === 'true'
    const exist = await knex.schema.hasTable(tableName)

    if (shouldDropTable && exist) {
      await knex.schema.dropTable(tableName)
    }

    if (!shouldDropTable && exist) return

    const sb = knex.schema.createTable(tableName, t => {
      Object.values(this.columns).forEach(column => column.buildTableBuilder(t))

      if (this.#config.index) t.index(...this.#config.index)
      if (this.#config.primary) t.primary(this.#config.primary)
    })

    this.emit('createTable', sb)

    return sb
  }

  private prepareQuery(qb: Knex.QueryBuilder) {
    // append a relation query if needed
    Object.entries(this.columns).forEach(([name, column]) => isQuerySelect(qb, name) && column.appendRelationQuery(qb, this.tableName))
  }

  private init() {
    this.on('query', queryBuilder => {
      log.debug('start query')
      this.prepareQuery(queryBuilder)
    })
  }

  private compileSchema() {
    return Object.entries(this.columns).reduce((acc, [name, column]) => {
      return acc.extend({
        [name]: column.schema
      })
    }, z.object({})) as ResolveModelSchema<C>
  }

  private compileColumns(columns: C) {
    return Object.entries(columns).reduce<Record<string, Column>>((acc, [name, column]) => {
      column.name = name
      acc[name] = column

      return acc
    }, {})
  }
}

export declare interface Model<C, T> {
  on<E extends EventName>(eventName: E, listener: (...args: EventArgs<E, C>) => void): this
  emit<E extends EventName>(eventName: E, ...args: EventArgs<E, C>): boolean
}

type EventName = | 'createTable' | 'query' | 'response'

type EventArgs<E extends EventName, T extends SomeColumns> =
 E extends 'createTable' ? [Knex.SchemaBuilder] :
   E extends 'query' ? [Knex.QueryBuilder] :
     E extends 'response' ? [Record<string, unknown>] : never

type SomeColumns = Record<string, Column>

type ResolveModelSchema<T extends SomeColumns> = ZodObject<{
  [K in keyof T]-?: T[K] extends Column ? T[K]['schema'] : ZodUnknown
}>

type ColumnNames<T extends SomeColumns> = Extract<keyof T, string>
