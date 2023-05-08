import db from 'core/db'
import { Dataset } from 'core/models/dataset'
import { viewSchema } from 'core/models/dataset/view.schema'
import { Controller } from 'core/server/controller'
import merge from 'lodash/merge'

import { datasetError } from './dataset.error'
import { validateViewFields } from './helpers/validateViewFields'

export const updateView = new Controller(
  async (ctx, next) => {
    const {
      access: { guard },
      getDataset: { dataset },
      getDatasetView: { view, index: viewIndex }
    } = ctx.state
    const { appId, id: datasetId } = dataset
    const viewId = view.id
    const { name, sorts, field, filter, fields, stickyField } = ctx.request.body

    guard('app:dataset:view:update', { appId, datasetId, viewId })

    const freshView = merge(view, {
      name,
      sorts,
      field,
      filter,
      fields,
      stickyField
    })
    const validated = validateViewFields(freshView, Object.keys(dataset.fields))

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
      field: true,
      fields: true,
      stickyField: true
    }).deepPartial(),
    response: {
      204: null
    }
  }
)
