import db from 'backend/db'
import { Dataset } from 'backend/models/dataset'
import { viewSchema } from 'backend/models/dataset/view.schema'
import { Controller } from 'backend/server/controller'
import merge from 'lodash/merge'

import { datasetError } from './dataset.error'
import { validateViewColumns } from './utils/validateViewColumns'

export const updateView = new Controller(
  async (ctx, next) => {
    const {
      access: { guard },
      getDataset: { dataset },
      getDatasetView: { view, index: viewIndex }
    } = ctx.state
    const { appId, id: datasetId } = dataset
    const viewId = view.id
    const { name, sorts, column, filter, columns, stickyColumn } = ctx.request.body

    guard('app:dataset:view:update', { appId, datasetId, viewId })

    const freshView = merge(view, {
      name,
      sorts,
      column,
      filter,
      columns,
      stickyColumn
    })
    const validated = validateViewColumns(freshView, Object.keys(dataset.column))

    if (!validated) return ctx.throw(datasetError('invalidView'))

    await Dataset.query
      .where({ id: datasetId, appId })
      .update('views', db.jsonSet('views', `$.${viewIndex}`, JSON.stringify(freshView)))

    ctx.status = 204

    await next()
  },
  {
    state: ['auth', 'access', 'getDataset', 'getDatasetView'],
    body: viewSchema.pick({
      name: true,
      sorts: true,
      filter: true,
      stickyColumn: true,
      column: true,
      columns: true
    }).deepPartial(),
    response: {
      204: null
    }
  }
)
