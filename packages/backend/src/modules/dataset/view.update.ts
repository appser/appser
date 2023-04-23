import db from 'backend/db'
import { Dataset, safeDatasetSchema, viewColumnSchema, viewSchema } from 'backend/models/dataset'
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
      column: z.record(viewColumnSchema.deepPartial())
    }).deepPartial(),
    response: {
      204: null
    }
  }
)
