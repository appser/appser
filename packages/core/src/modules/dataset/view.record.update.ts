import { Controller } from 'core/server/controller'
import jsonSchema from 'core/utils/jsonSchema'
import { rNumId } from 'core/utils/regex'
import { z } from 'zod'

export const updateViewRecord = new Controller(
  async (ctx, next) => {
    const {
      auth: { currentUser },
      access: { guard },
      getDataset: { dataset, record: { model } },
      getDatasetView: { view }
    } = ctx.state
    const { appId, id: datasetId } = dataset
    const { recordId } = ctx.params
    const { id: viewId } = view.toJSON()
    const data = ctx.request.body

    guard('app:dataset:view:record:field:update', { appId, datasetId, viewId, recordId, fieldName: '*' })

    await model.query
      .where('id', recordId)
      .update({
        data,
        lastEditor: currentUser.id,
        updatedAt: new Date().toISOString()
      } as never)

    ctx.status = 204

    await next()
  },
  {
    state: ['auth', 'access', 'getDataset', 'getDatasetView'],
    params: z.object({
      datasetId: z.string().regex(rNumId),
      recordId: z.string().regex(rNumId)
    }),
    body: z.object({}).catchall(z.unknown()),
    response: {
      204: null
    }
  }
)
