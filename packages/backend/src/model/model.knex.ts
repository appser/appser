import { createLogger } from 'backend/logger'
import { Model } from 'backend/model'
import { type Knex as KnexOriginal, knex } from 'knex'

import type { Tables } from 'knex/types/tables'

const log = createLogger('knex:model')

knex.QueryBuilder.extend('model', handler)

function handler(this: KnexOriginal.QueryBuilder, _model?: Model) {
  const { table } = this._single
  const model = _model ?? Model.get(table)

  return this.queryContext({ model })
    .on('start', (builder: KnexOriginal.QueryBuilder) => {
      const { insert: originInserts, update: originUpdate } = builder._single
      const method = builder._method

      model.emit('startQuery', builder)

      if (method === 'insert' && originInserts) {
        model.emit('preInsert', originInserts)

        const inserts = model.state.insert

        log.debug('transformed inserts', inserts)

        if (inserts) {
          builder._single.insert = inserts
          model.emit('insert', inserts)
        }
      }

      if (method === 'update' && originUpdate) {
        model.emit('preUpdate', originUpdate)

        const update = model.state.update

        log.debug('transformed update', update)

        if (update) {
          builder._single.update = update
          model.emit('update', update)
        }
      }

      if (method === 'del') model.emit('delete')
    })
    .on('query-response', (response: unknown, obj: KnexResponseObject) => {
      if (obj.response?.command === 'SELECT') {
        model.emit('preRespond', response)

        response = model.state.response
        model.emit('respond', model.state.response)
      }

      model.emit('endQuery')
    })
    .on('query-error', () => {
      model.emit('endQuery')
    })
}

export default {
  method: 'model',
  handler
}

interface KnexResponseObject {
  response: {
    command?: 'SELECT'
    rowCount: number
    rows: Record<string, unknown>[]
  }
}

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
      model: (model?: Model) => KnexOriginal.QueryBuilder<TRecord, TResult>
    }
  }
}
