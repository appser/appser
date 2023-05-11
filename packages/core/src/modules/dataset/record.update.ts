import db from 'core/db'
import { Controller } from 'core/server/controller'
import { z } from 'zod'

export const updateRecord = new Controller(
  async (ctx, next) => {
    const {
      auth: { currentUser },
      access: { guard },
      getDataset: { dataset, record: { model } }
    } = ctx.state
    const { id: datasetId, appId } = dataset
    const { recordId } = ctx.params
    const data = ctx.request.body

    guard('app:dataset:record:field:update', { appId, datasetId, recordId, fieldName: '*' })

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
    state: ['auth', 'access', 'getDataset'],
    params: z.object({
      recordId: z.string()
    }),
    body: z.object({}).catchall(z.unknown()),
    response: {
      204: null
    }
  }
)
