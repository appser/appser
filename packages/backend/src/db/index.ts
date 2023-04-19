import knex from 'knex'
import './extend'

import knexfile from './knexfile'
import { processResponse } from './utils/processResponse'
import { snakeCase } from './utils/snakeCase'

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

export interface Dataset {}

declare module 'knex/types/tables' {
  interface Tables extends Dataset {}
}
