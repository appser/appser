import { Dataset } from 'core/models/dataset'
import { Controller } from 'core/server/controller'

export const deleteView = new Controller(
  async (ctx, next) => {
    const {
      access: { guard },
      getDataset: { dataset },
      getDatasetView: { view }
    } = ctx.state
    const { appId, id: datasetId } = dataset
    const viewId = view.id

    guard('app:dataset:view:delete', { appId, datasetId, viewId })

    const views = dataset.views.filter(view => view.id !== viewId)
    await Dataset.query.where({ id: datasetId }).update('views', views)

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
