import db from 'core/db'
import { createLogger } from 'core/logger'
import { Schema, z } from 'zod'

import { Path } from './path'

import type { Columns, Models } from 'core/model'
import type { Knex } from 'knex'
import type { ZodNever, ZodObject } from 'zod'

type DataType = 'smallint' | 'integer' | 'bigint' | 'decimal' | 'text' | 'boolean' |
'date' | 'datetime' | 'timestamp' | 'geometry' | 'geography' | 'jsonb'

type RelationType = 'oneToOne' | 'oneToMany'

interface Config {
  index?: Parameters<Knex.ColumnBuilder['index']>
  primary?: Parameters<Knex.ColumnBuilder['primary']>
  unique?: Parameters<Knex.ColumnBuilder['unique']>
  relation?: {
    type: RelationType
    table: string
    referenceKey: unknown
    selects: unknown
  }
}

const log = createLogger('model:column')

export class Column<S extends Schema = Schema> {
  name?: string
  schema
  dataType
  config: Config = {}

  constructor(dataType: DataType, schema: S) {
    this.schema = schema
    this.dataType = dataType
  }

  relation<T extends keyof Models, R extends Columns<T>, S extends Columns<T>[]>(
    table: T,
    referenceKey: R,
    selects: S,
    type: RelationType = 'oneToOne'
  ) {
    this.config.relation = {
      type,
      table,
      referenceKey,
      selects
    }

    return this
  }

  index(...args: NonNullable<Config['index']>) {
    this.config.index = args

    return this
  }

  primary(...args: NonNullable<Config['primary']>) {
    this.config.primary = args

    return this
  }

  unique(...args: NonNullable<Config['unique']>) {
    this.config.unique = args

    return this
  }

  appendRelationQuery(qb: Knex.QueryBuilder, fromTable: string) {
    if (!this.name) throw new Error('column name required')

    if (this.config.relation) {
      const { table, referenceKey, selects, type } = this.config.relation

      log.debug('append relation query:', table, referenceKey, selects, type)

      if (type === 'oneToMany') {
        qb.select(
          db.raw('(select json_agg(t) from (select ?? from ?? where ?? = ??) t) as ??', [
            selects,
            table,
            referenceKey,
            `${fromTable}.${this.name}`,
            this.name
          ])
        )
      }

      if (type === 'oneToOne') {
        qb.select(
          db.raw('(select json_agg(t)->0 from (select ?? from ?? where ?? = ?? limit ?) t) as ??', [
            selects,
            table,
            referenceKey,
            `${fromTable}.${this.name}`,
            1,
            this.name
          ])
        )
      }
    }
  }

  buildTableBuilder(t: Knex.TableBuilder) {
    if (!this.name) throw new Error('Column name is required')

    const _t = t[this.dataType](this.name)

    if (this.config.index) _t.index(...this.config.index)
    if (this.config.primary) _t.primary(...this.config.primary)
    if (this.config.unique) _t.unique(...this.config.unique)

    return _t
  }
}

export function column<S extends ColumnType>(dataType: DataType, schema: S) {
  const _schema: Schema = schema instanceof Schema
    ? schema
    : Object.entries(schema).reduce((acc, [name, subSchema]) => {
      return acc.extend({
        [name]: subSchema instanceof Path ? subSchema.schema : subSchema
      })
    }, z.object({}))

  // @ts-expect-error TODO: fix type error
  return new Column<ResolveColumnSchema<S>>(dataType, _schema)
}

export type ColumnType = Schema | Record<string, Schema | Path>

type ResolveColumnSchema<T extends ColumnType> = T extends Schema
  ? T
  : T extends Record<string, infer S>
    ? ZodObject<{
      [K in keyof T]-?: T[K] extends Schema ? T[K] : T[K] extends Path ? T[K]['schema'] : ZodNever
    }>
    : ZodNever
