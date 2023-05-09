import type { Knex } from 'knex'

export { column } from './column'
export { Model } from './model'
export { path } from './path'

export type Columns<T extends keyof Models> = keyof Knex.ResolveTableType<Models[T]>

export interface Models {}

declare module 'knex/types/tables' {
  interface Tables extends Models {}
}
