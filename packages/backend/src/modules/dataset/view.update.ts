import db from 'backend/db'
import { Dataset } from 'backend/models/dataset'
import { safeDatasetSchema } from 'backend/models/dataset/dataset.schema'
import { viewColumnSchema } from 'backend/models/dataset/view.column.schema'
import { viewSchema } from 'backend/models/dataset/view.schema'
import { Controller } from 'backend/server/controller'
import merge from 'lodash/merge'
import { z } from 'zod'

import { datasetError } from './dataset.error'

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
    const parser = safeDatasetSchema.safeParse(Object.assign({}, dataset, { views: [freshView] }))

    if (!parser.success) return ctx.throw(datasetError('invalidView', parser.error.formErrors))

    await Dataset.query
      .where({ id: datasetId, appId })
      .update('views', db.jsonSet('views', `$.${viewIndex}`, JSON.stringify(parser.data.views[0])))

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
      columns: true
    }).extend({
      column: viewColumnSchema
    }).deepPartial(),
    response: {
      204: null
    }
  }
)
