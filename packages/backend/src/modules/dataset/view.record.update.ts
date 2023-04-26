import db from 'backend/db'
import { Controller } from 'backend/server/controller'
import jsonSchema from 'backend/utils/jsonSchema'
import { rNumId } from 'backend/utils/regex'
import { z } from 'zod'

export const updateViewRecord = new Controller(
  async (ctx, next) => {
    const {
      auth: { currentUser },
      access: { guard },
      getDataset: { dataset, model },
      getDatasetView: { view }
    } = ctx.state
    const { appId, id: datasetId } = dataset
    const { recordId } = ctx.params
    const { id: viewId } = view
    const data = ctx.request.body

    guard('app:dataset:view:record:column:update', { appId, datasetId, viewId, recordId, columnName: '*' })

    await db(dataset.id)
      .model(model)
      .where('id', recordId)
      .update({
        ...data,
        lastEditor: currentUser.id,
        updatedAt: new Date().toISOString()
      })

    ctx.status = 204

    await next()
  },
  {
    state: ['auth', 'access', 'getDataset', 'getDatasetView', 'getDatasetRecord'],
    params: z.object({
      datasetId: z.string().regex(rNumId),
      recordId: z.string().regex(rNumId)
    }),
    body: jsonSchema as any, // TODO: fix type
    response: {
      204: null
    }
  }
)
