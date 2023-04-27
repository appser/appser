import { modelError } from 'backend/model/model.error'
import { z } from 'zod'

import Field from './field'
import { columnConfigSchema } from './schemas/column.config.schema'

import type { Knex } from 'knex'

export class Column {
  field

  constructor(public readonly name: string, public config: z.infer<typeof columnConfigSchema>) {
    const parser = columnConfigSchema.safeParse(config)

    if (!parser.success) {
      throw modelError('invalidColumnConfig', parser.error.formErrors)
    }

    this.name = name
    this.config = parser.data
    this.field = new Field(config.field).options(this.config.options)
  }

  get schema() {
    let s

    s = z.object({
    // override schema, only for custom field
      [this.name]: this.config.field === 'custom' ? this.config.schema : this.field.schema
    }).partial()

    if (this.config.isRequired) s = s.required()

    return s
  }

  toColumnBuilder(t: Knex.TableBuilder) {
    const field = this.field
    const column = t[field.baseType](this.name)

    return column
  }
}
