import knex from 'knex'
import './extend'

import knexfile from './knexfile'
import { processResponse } from './utils/processResponse'
import { snakeCase } from './utils/snakeCase'

import type { Tables } from 'knex/types/tables'

const db = knex({
  ...knexfile,
  wrapIdentifier: (
    value,
    origImpl,
    queryContext
  ) => origImpl(snakeCase(value)),
  postProcessResponse: (result, queryContext) => processResponse(result)
})

export { default as connect } from './connect'

export default db

declare module 'knex' {
  namespace Knex {
    interface QueryInterface<TRecord extends {} = any, TResult = any> {
      _method: 'insert' | 'update' | 'select' | 'del' | 'first' | 'pluck' | 'truncate' | 'columnInfo'
      _single: {
        limit?: number
        table: keyof Tables
        insert?: unknown
        update?: unknown
      }
    }
  }
}
