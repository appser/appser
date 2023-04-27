import db from 'backend/db'
import { Dataset } from 'backend/models/dataset'
import { Controller } from 'backend/server/controller'

import { datasetError } from './dataset.error'
import cleanViewColumn from './utils/cleanViewColumn'

export const deleteColumn = new Controller(
  async (ctx, next) => {
    const {
      access: { guard },
      getDataset: { dataset },
      getDatasetColumn: { column }
    } = ctx.state
    const { appId, id: datasetId } = dataset
    const name = column.name

    guard('app:dataset:column:delete', { appId, datasetId, columnName: name })

    if (column.isLocked) return ctx.throw(datasetError('columnIsLocked'))

    await db.transaction(async trx => {
      delete dataset.column[name]

      dataset.views.forEach(view => cleanViewColumn(view, name))

      await Dataset.query
        .where({ id: datasetId })
        // TODO: test
        .update({
          column: dataset.column,
          views: dataset.views
        })
        .transacting(trx)

      await db.schema
        .alterTable(datasetId, t => {
          t.dropColumn(name)
        })
        .transacting(trx)
    })

    ctx.status = 204
    ctx.body = null

    await next()
  },
  {
    state: ['auth', 'access', 'getDataset', 'getDatasetColumn'],
    response: {
      204: null
    }
  }
)
