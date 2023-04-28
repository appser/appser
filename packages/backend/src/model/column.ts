import { modelError } from 'backend/model/model.error'
import { z } from 'zod'

import { Field } from './field'
import { columnConfigSchema } from './schemas/column.config.schema'

import type { DataType } from './field'
import type { Knex } from 'knex'
import type { Schema } from 'zod'

interface BaseColumn {
  dataType: DataType
  schema: z.Schema
  toColumnBuilder: (t: Knex.TableBuilder) => Knex.ColumnBuilder
}

export class Column implements BaseColumn {
  field
  dataType
  config

  readonly name: string

  constructor(name: string, config: z.infer<typeof columnConfigSchema>) {
    const parser = columnConfigSchema.safeParse(config)

    if (!parser.success) {
      throw modelError('invalidColumnConfig', parser.error.formErrors)
    }

    this.name = name
    this.config = parser.data
    this.field = Field.create(config.field).withOptions(this.config.options)
    this.dataType = this.field.dataType
  }

  get schema() {
    let s

    s = z.object({
      [this.name]: this.field.schema
    }).partial()

    if (this.config.required) s = s.required()

    return s
  }

  toColumnBuilder(t: Knex.TableBuilder) {
    return t[this.dataType](this.name)
  }
}

export class CustomColumn<S extends Schema = Schema> implements BaseColumn {
  name?: string

  constructor(public schema: S, public dataType: DataType) {
    this.schema = schema
    this.dataType = dataType
  }

  toColumnBuilder(t: Knex.TableBuilder) {
    if (!this.name) throw new Error('CustomColumn name is required')

    return t[this.dataType](this.name)
  }
}

export function column<S extends Schema, D extends DataType>(schema: S, dataType: D) {
  return new CustomColumn<S>(schema, dataType)
}

export type SomeColumn = Column | CustomColumn
