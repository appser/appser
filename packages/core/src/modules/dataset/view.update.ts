import db from 'core/db'
import { Dataset } from 'core/models/dataset'
import { viewSchema } from 'core/modules/dataset/helpers/view/view.schema'
import { Controller } from 'core/server/controller'

export const updateView = new Controller(
  async (ctx, next) => {
    const {
      access: { guard },
      getDataset: { dataset },
      getDatasetView: { view, index: viewIndex }
    } = ctx.state
    const { appId, id: datasetId } = dataset
    const { id: viewId } = view.toJSON()
    const { name, sorts, field, filter, fields, stickyField } = ctx.request.body

    guard('app:dataset:view:update', { appId, datasetId, viewId })

    const config = view.update({
      name,
      sorts,
      field,
      filter,
      fields,
      stickyField
    }).toJSON()

    await Dataset.query
      .where({ id: datasetId, appId })
      .update('views', db.jsonSet('views', `$.${viewIndex}`, JSON.stringify(config)))

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
