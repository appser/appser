import { Controller } from 'core/server/controller'
import { z } from 'zod'

export const addViewRecord = new Controller(
  async (ctx, next) => {
    const {
      access: { guard },
      auth: { currentUser },
      getDataset: { dataset, record: { model } },
      getDatasetView: { view }
    } = ctx.state
    const { appId, id: datasetId } = dataset
    const { id: viewId } = view.toJSON()
    const data = ctx.request.body

    guard('app:dataset:view:record:add', { appId, datasetId, viewId })

    await model.query.insert({
      datasetId,
      data,
      creator: currentUser.id,
      lastEditor: currentUser.id
    } as never)

    ctx.status = 201

    await next()
  },
  {
    state: ['auth', 'access', 'getDataset', 'getDatasetView'],
    body: z.object({}).catchall(z.unknown()),
    response: {
      201: null
    }
  }
)
