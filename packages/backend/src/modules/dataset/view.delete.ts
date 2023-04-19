import { Dataset } from 'backend/models/dataset'
import { Controller } from 'backend/server/controller'
import { serverError } from 'backend/server/server.error'

export const deleteView = new Controller(
  async (ctx, next) => {
    const {
      access: { can },
      getDataset: { dataset },
      getDatasetView: { view }
    } = ctx.state
    const { appId, id: datasetId } = dataset
    const viewId = view.id
    const { deny } = can('app:dataset:view:delete', { appId, datasetId, viewId })

    if (deny) return ctx.throw(serverError('accessForbidden'))

    const views = dataset.views.filter(view => view.id !== viewId)
    await Dataset.query.where({ id: datasetId }).update('views', JSON.stringify(views))

    ctx.status = 204

    await next()
  },
  {
    state: ['auth', 'access', 'getDataset', 'getDatasetView'],
    response: {
      204: null
    }
  }
)
