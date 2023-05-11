import { column } from 'core/db/model/column'
import { createLogger } from 'core/logger'
import { z } from 'zod'

import type { Column } from 'core/db/model/column'
import type { Path } from 'core/db/model/path'
import type { FieldConfig } from 'core/modules/dataset/helpers/field/field.schema'
import type { Schema } from 'zod'

const log = createLogger('dataset:field')

interface Meta<S, O extends Schema> {
  optionSchema?: O
  schema: S | ((o: z.infer<O>) => S)
}

export class Field {
  static store: { [T in string]?: Meta<unknown, Schema> } = {}

  name

  #config
  #meta
  #options: unknown

  constructor(name: string, config: FieldConfig) {
    const { type, options } = config
    const meta = Field.store[type]

    if (!meta) throw new Error(`Field type '${type}' not stored, define it first.`)

    this.name = name
    this.#config = config
    this.#meta = meta

    const optionParser = meta.optionSchema?.safeParse(options)

    if (optionParser) {
      if (!optionParser?.success) throw new Error(`Field type '${type}' options invalid.`)
      this.#options = optionParser?.data
    }
  }

  static define<S, O extends Schema>(type: string, meta: Meta<S, O>) {
    Object.assign(this.store, { [type]: meta })

    log.debug('defined field type', type)

    return {
      schema: meta.schema,
      optionSchema: meta.optionSchema ?? z.never().optional()
    }
  }

  static toColumnWithFields(fields: Record<string, FieldConfig>): Column {
    const schema = Object.entries(fields).reduce((acc, [name, config]) => {
      let s = new Field(name, config).schema.optional()

      if (config.required) s = s.required()

      acc[name] = s

      return acc
    }, {} as Record<string, Schema | Path>)

    return column('jsonb', schema)
  }

  get schema() {
    const { schema } = this.#meta

    if (!schema) throw new Error('Schema not defined')

    return typeof schema === 'function' ? schema(this.#options) : schema
  }

  get optionSchema() {
    return this.#meta.optionSchema ?? z.object({})
  }

  get locked() {
    return this.#config.locked
  }

  toJSON() {
    return {
      ...this.#config,
      name: this.name
    }
  }
}
