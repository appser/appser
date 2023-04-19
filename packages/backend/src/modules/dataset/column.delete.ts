import db from 'backend/db'
import { Dataset } from 'backend/models/dataset'
import { Controller } from 'backend/server/controller'
import { serverError } from 'backend/server/server.error'

import { datasetError } from './dataset.error'

export const deleteColumn = new Controller(
  async (ctx, next) => {
    const {
      access: { can },
      getDataset: { dataset },
      getDatasetColumn: { column }
    } = ctx.state
    const { appId, id: datasetId } = dataset
    const { deny } = can('app:dataset:column:delete', { appId, datasetId, columnName: column.name })
    const name = column.name

    if (deny) return ctx.throw(serverError('accessForbidden'))
    if (column.isLocked) return ctx.throw(datasetError('columnIsLocked'))

    await db.transaction(async trx => {
      delete dataset.column[name]

      dataset.views.forEach(view => {
        delete view.column?.[name]
      })

      await Dataset.query
        .where({ id: datasetId })
        .update('column', JSON.stringify(dataset.column))
        .update('views', JSON.stringify(dataset.views))
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
