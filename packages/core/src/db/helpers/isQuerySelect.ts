import { createLogger } from 'core/logger'
import intersection from 'lodash/intersection'

import type { Knex } from 'knex'

const log = createLogger('model:helper')

export function isQuerySelect(qb: Knex.QueryBuilder, columnName: string) {
  const { _method, _statements, _single } = qb

  if (['select', 'first'].includes(_method) && _single.table) {
    const columns = _statements.find(s => s.grouping === 'columns')?.value ?? []

    if (_statements.length === 0) return true

    if (intersection(columns, [columnName, '*', `${_single.table}.${columnName}`, `${_single.table}.*`]).length > 0) {
      log.debug(`is query select ${columnName}:`, true)

      return true
    }
  }

  log.debug(`is query select ${columnName}:`, false)

  return false
}

declare module 'knex' {
  namespace Knex {
    interface QueryInterface {
      _statements: { grouping?: 'columns' | string; value?: string[] }[]
    }
  }
}
