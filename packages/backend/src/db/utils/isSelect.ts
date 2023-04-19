import { createLogger } from 'backend/logger'
import intersection from 'lodash/intersection'

import type { Knex } from 'knex'

const log = createLogger('db:helper')

export default function isSelect(query: Knex.QueryBuilder, column: string) {
  const { _method, _statements, _single } = query

  if (['select', 'first'].includes(_method) && _single.table) {
    const columns = _statements.find(s => s.grouping === 'columns')?.value ?? []

    if (_statements.length === 0) return true

    if (intersection(columns, [column, '*', `${_single.table}.${column}`, `${_single.table}.*`]).length > 0) {
      log.debug(`query builder selects column ${column}`, columns)

      return true
    }
  }

  log.debug(`query builder didn't select column "${column}"}`)

  return false
}

declare module 'knex' {
  namespace Knex {
    interface QueryInterface {
      _statements: { grouping?: 'columns' | string; value?: string[] }[]
    }
  }
}
