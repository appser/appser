/**
 * There are two methods to define column:
 * 1. FieldColumn: a column that is defined by a field
 * 2. CustomColumn: a column that is defined by a custom column builder
 */
import { modelError } from 'backend/model/errors'
import { z } from 'zod'

import { Field } from './field'
import { fieldColumnConfigSchema } from './schemas/column.config.schema'

import type { DataType } from './field'
import type { TFieldColumnConfig } from './schemas/column.config.schema'
import type { Knex } from 'knex'
import type { Schema } from 'zod'

interface BaseColumn {
  dataType: DataType
  schema: z.Schema
  toColumnBuilder: (t: Knex.TableBuilder) => Knex.ColumnBuilder
}

export class FieldColumn<C extends TFieldColumnConfig = TFieldColumnConfig> implements BaseColumn {
  field
  dataType
  config

  readonly name: string

  constructor(name: string, config: C) {
    const parser = fieldColumnConfigSchema.safeParse(config)

    if (!parser.success) {
      console.log(parser.error.formErrors, config)

      throw modelError('invalidColumnConfig', parser.error.formErrors)
    }

    this.name = name
    this.config = parser.data as C
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
  schema
  dataType

  constructor(schema: S, dataType: DataType) {
    this.schema = schema
    this.dataType = dataType
  }

  toColumnBuilder(t: Knex.TableBuilder) {
    if (!this.name) throw new Error('CustomColumn name is required')

    return t[this.dataType](this.name)
  }
}

export function custom<S extends Schema, D extends DataType>(schema: S, dataType: D) {
  return new CustomColumn<S>(schema, dataType)
}

export type TSomeColumn = FieldColumn | CustomColumn
