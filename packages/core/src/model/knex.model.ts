import { Model } from 'core/model'
import { type Knex as KnexOriginal, knex } from 'knex'

knex.QueryBuilder.extend('model', handler)

function handler(this: KnexOriginal.QueryBuilder, _model?: Model) {
  const { table } = this._single
  const model = _model ?? Model.get(table) as Model

  return this.queryContext({ model })
    .on('start', (builder: KnexOriginal.QueryBuilder) => {
      const { insert: insertData, update: updateData } = builder._single
      const method = builder._method

      model.emit('query', builder)

      if (method === 'insert' && insertData) {
        builder._single.insert = model.validator.parseInsert(insertData)
      }

      if (method === 'update' && updateData) {
        builder._single.update = model.validator.parseUpdate(updateData)
      }
    })
    .on('query-response', (response: unknown, obj: KnexResponseObject) => {
      if (obj.response?.command === 'SELECT') {
        response = model.validator.transformResponse(response)
      }
    })
    .on('query-error', () => {
    })
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
      model: (model?: Model) => KnexOriginal.QueryBuilder<TRecord, TResult>
      _queryContext?: {
        model?: Model
      }
    }
  }
}
