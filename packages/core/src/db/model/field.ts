// TODO
import type { Schema } from 'zod'

interface Config {
  relation?: {
    type: 'oneToOne' | 'oneToMany'
    table: string
    referenceKey: unknown
    selects: unknown[]
  }
}

export class Field<S extends Schema = Schema> {
  parent: string
  schema: Schema
  config: Config = {}

  constructor(schema: S) {
    this.schema = schema
    this.parent = ''
  }

  // relation<T extends keyof Models, R extends Columns<T>, S extends Columns<T>[]>(table: T, referenceKey: R, selects: S) {
  //   return this
  // }
}

export function field<S extends Schema>(schema: S) {
  return new Field<S>(schema)
}
