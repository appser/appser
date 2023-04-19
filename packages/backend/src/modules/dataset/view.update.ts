import db from 'backend/db'
import { Dataset, unsafeViewSchema, viewColumnSchema, viewSchema } from 'backend/models/dataset'
import { Controller } from 'backend/server/controller'
import { serverError } from 'backend/server/server.error'
import merge from 'lodash/merge'
import { z } from 'zod'

import { datasetError } from './dataset.error'

export const updateView = new Controller(
  async (ctx, next) => {
    const {
      access: { can },
      getDataset: { dataset },
      getDatasetView: { view, index: viewIndex }
    } = ctx.state
    const { appId, id: datasetId } = dataset
    const viewId = view.id
    const { name, sorts, column, filter, stickyColumn } = ctx.request.body
    const { deny } = can('app:dataset:view:update', { appId, datasetId, viewId })

    if (deny) return ctx.throw(serverError('accessForbidden'))

    if (column && Object.keys(column).some(c => !view.column[c])) {
      return ctx.throw(datasetError('viewColumnNotFound'))
    }

    const freshView = merge(view, {
      name,
      sorts,
      column,
      filter,
      stickyColumn
    })
    const parser = viewSchema.parse(freshView)

    await Dataset.query
      .where({ id: datasetId, appId })
      .update('views', db.jsonSet('views', `$.${viewIndex}`, JSON.stringify(freshView)))

    ctx.status = 204

    await next()
  },
  {
    state: ['auth', 'access', 'getDataset', 'getDatasetView'],
    body: unsafeViewSchema.pick({
      name: true,
      sorts: true,
      filter: true,
      stickyColumn: true
    })
      .extend({
        column: z.record(viewColumnSchema.deepPartial())
      })
      .deepPartial(),
    response: {
      204: null
    }
  }
)
