import { createLogger } from 'backend/logger'
import { z } from 'zod'

import type { FieldConfig } from 'backend/models/dataset/field.schema'
import type { Schema } from 'zod'

const log = createLogger('dataset:field')

interface Meta<S, O extends Schema> {
  optionSchema?: O
  schema: S | ((o: z.infer<O>) => S)
}

export class Field {
  static store: { [T in string]?: Meta<unknown, Schema> } = {}

  name
  config

  #options: unknown
  #meta

  constructor(name: string, config: FieldConfig) {
    const { type, options } = config
    const meta = Field.store[type]

    if (!meta) throw new Error(`Field type '${type}' not stored, define it first.`)

    this.name = name
    this.config = config
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
      optionSchema: meta.optionSchema ?? z.never().optional()
    }
  }

  get schema() {
    const { schema } = this.#meta

    if (!schema) throw new Error('Schema not defined')

    return typeof schema === 'function' ? schema(this.#options) : schema
  }

  get optionSchema() {
    return this.#meta.optionSchema ?? z.object({})
  }
}
