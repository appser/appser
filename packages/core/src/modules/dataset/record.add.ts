import { Controller } from 'core/server/controller'
import { z } from 'zod'

export const addRecord = new Controller(
  async (ctx, next) => {
    const {
      access: { guard },
      auth: { currentUser },
      getDataset: { dataset, record: { model } }
    } = ctx.state
    const { appId, id: datasetId } = dataset
    const data = ctx.request.body

    guard('app:dataset:record:add', { appId, datasetId })

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
    state: ['auth', 'access', 'getDataset'],
    body: z.object({}).catchall(z.unknown()),
    response: {
      201: null
    }
  }
)
