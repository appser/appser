import db from 'backend/db'
import { Controller } from 'backend/server/controller'
import jsonSchema from 'backend/utils/jsonSchema'

export const addViewRecord = new Controller(
  async (ctx, next) => {
    const {
      access: { guard },
      auth: { currentUser },
      getDataset: { dataset, model },
      getDatasetView: { view }
    } = ctx.state
    const { appId, id: datasetId } = dataset
    const { id: viewId } = view
    const data = ctx.request.body

    guard('app:dataset:view:record:add', { appId, datasetId, viewId })

    await db(dataset.id).model(model).insert({
      ...data, // TODO: omit private columns
      creator: currentUser.id,
      lastEditor: currentUser.id
    })

    ctx.status = 201

    await next()
  },
  {
    state: ['auth', 'access', 'getDataset', 'getDatasetView'],
    body: jsonSchema as any, // TODO: fix type
    response: {
      201: null
    }
  }
)
