import { Dataset } from 'backend/models/dataset'
import { Controller } from 'backend/server/controller'

import { datasetError } from './dataset.error'
import cleanColumnFromView from './utils/cleanColumnFromView'

/**
 * TODO:
 * 1. Currently, we are using a soft delete method, but we will need to implement hard timed delete in the future.
 * 2. There are no ways to restore the deleted column, because the column metadata is permanently deleted.
 */
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

    if (column.config.isLocked) return ctx.throw(datasetError('columnIsLocked'))

    dataset.column[name].deletedAt = new Date()
    dataset.views.forEach(view => cleanColumnFromView(name, view))

    await Dataset.query
      .where({ id: datasetId })
    // TODO: test
      .update({
        column: dataset.column,
        views: dataset.views
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
