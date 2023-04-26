/**
 * use like this:
 * db('table').sort(['name', '-id'])
 */
import { type Knex as KnexOriginal, knex } from 'knex'

knex.QueryBuilder.extend('sort', handler)

type Sort = string[]

function handler(this: KnexOriginal.QueryBuilder, sort: Sort = []) {
  const orderBy = sort?.map(s => {
    const sort = s.startsWith('-') ? [s.slice(1), 'desc'] : [s, 'asc']
    const [columnName, direction] = sort

    return {
      column: columnName,
      order: direction
    }
  })

  return this.orderBy(orderBy)
}

declare module 'knex' {
  namespace Knex {
    interface QueryInterface<TRecord extends {} = any, TResult = any> {
      sort: (sort: Sort) => KnexOriginal.QueryBuilder<TRecord, TResult>
    }
  }
}
