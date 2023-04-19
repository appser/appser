/**
 * serialize where conditions, shared between backend and frontend
 */
import { type Knex as KnexOriginal, knex } from 'knex'

import { dbError } from '../db.error'

import type { Filter } from '.'
import type { Condition, ConditionBetween } from './condition'
import type { Operator } from './operator'

knex.QueryBuilder.extend('filter', handler)

function convertConditionToWhere(this: KnexOriginal.QueryBuilder, condition: Condition, logic: 'and' | 'or') {
  Object.entries(condition).forEach(([name, obj]) => {
    Object.entries(obj).forEach(([operators, value]) => {
      switch (operators as Operator) {
        case 'eq':
          this[logic === 'or' ? 'orWhere' : 'where'](name, value)

          break
        case 'neq':
          this[logic === 'or' ? 'orWhereNot' : 'whereNot'](name, value)

          break
        case 'gt':
          this[logic === 'or' ? 'orWhere' : 'where'](name, '>', value)

          break
        case 'gte':
          this[logic === 'or' ? 'orWhere' : 'where'](name, '>=', value)

          break
        case 'lt':
          this[logic === 'or' ? 'orWhere' : 'where'](name, '<', value)

          break
        case 'lte':
          this[logic === 'or' ? 'orWhere' : 'where'](name, '<=', value)

          break
        case 'in':
          this[logic === 'or' ? 'orWhereIn' : 'whereIn'](name, value as any[])

          break
        case 'nin':
          this[logic === 'or' ? 'orWhereNotIn' : 'whereNotIn'](name, value as any[])

          break
        case 'like':
          this[logic === 'or' ? 'orWhere' : 'where'](name, 'like', `%${value}%`)

          break
        case 'notLike':
          this[logic === 'or' ? 'orWhereNot' : 'whereNot'](name, 'like', `%${value}%`)

          break
        case 'between': {
          if (!Array.isArray(value) || value.length !== 3) throw dbError('invalidFilter')
          const [start, end, bounds] = value as ConditionBetween

          bounds.startsWith('[')
            ? this[logic === 'or' ? 'orWhere' : 'where'](name, '>=', start)
            : this[logic === 'or' ? 'orWhere' : 'where'](name, '>', start)
          bounds.endsWith(']')
            ? this[logic === 'or' ? 'orWhere' : 'where'](name, '<=', end)
            : this[logic === 'or' ? 'orWhere' : 'where'](name, '<', end)
        }

          break
        case 'notBetween': {
          if (!Array.isArray(value) || value.length !== 3) throw dbError('invalidFilter')
          const [start, end, bounds] = value as ConditionBetween

          bounds.startsWith('[')
            ? this[logic === 'or' ? 'orWhereNot' : 'whereNot'](name, '>=', start)
            : this[logic === 'or' ? 'orWhereNot' : 'whereNot'](name, '>', start)

          bounds.endsWith(']')
            ? this[logic === 'or' ? 'orWhereNot' : 'whereNot'](name, '<=', end)
            : this[logic === 'or' ? 'orWhereNot' : 'whereNot'](name, '<', end)
        }

          break
        case 'null':
          this[logic === 'or' ? 'orWhereNull' : 'whereNull'](name)

          break
        case 'notNull':
          this[logic === 'or' ? 'orWhereNotNull' : 'whereNotNull'](name)

          break
        default:
          break
      }
    })
  })
}

function handler(this: KnexOriginal.QueryBuilder, filter: Filter = {}) {
  const { and, or } = filter

  and?.forEach((condition) => convertConditionToWhere.call(this, condition, 'and'))
  or?.forEach((condition) => convertConditionToWhere.call(this, condition, 'or'))

  return this
}

declare module 'knex' {
  namespace Knex {
    interface QueryInterface<TRecord extends {} = any, TResult = any> {
      filter: (filter?: Filter) => KnexOriginal.QueryBuilder<TRecord, TResult>
    }
  }
}
