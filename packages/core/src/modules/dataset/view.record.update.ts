import db from 'core/db'
import { Controller } from 'core/server/controller'
import { z } from 'zod'

export const updateViewRecord = new Controller(
  async (ctx, next) => {
    const {
      auth: { currentUser },
      access: { guard },
      getDataset: { dataset, record: { model } },
      getDatasetRecord: { record },
      getDatasetView: { view }
    } = ctx.state
    const { id: datasetId, appId } = dataset
    const { recordId } = ctx.params
    const { id: viewId } = view.toJSON()
    const data = ctx.request.body

    guard('app:dataset:view:record:field:update', { appId, datasetId, viewId, recordId, fieldName: '*' })

    await model.query
      .where({
        datasetId,
        id: recordId
      })
      .update({
        // TODO: support nested object
        data: db.raw('?? || ?', ['data', model.schema.shape.data.strict().parse(data)]),
        lastEditor: currentUser.id,
        updatedAt: new Date()
      } as never)

    ctx.status = 204

    await next()
  },
  {
    state: ['auth', 'access', 'getDataset', 'getDatasetRecord', 'getDatasetView'],
    params: z.object({
      recordId: z.string()
    }),
    body: z.object({}).catchall(z.unknown()),
    response: {
      204: null
    }
  }
)
