import db from 'backend/db'
import { datasetError } from 'backend/modules/dataset/dataset.error'
import { Controller } from 'backend/server/controller'
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

    const availableColumns = Object
      .entries(model.columns)
      .reduce<Record<string, true>>((acc, [name, column]) => {
        if (!column.isLocked && view.column?.[name].selected) {
          acc[name] = true
        }

        return acc
      }, {})
    const schema = model.schema.pick(availableColumns).partial().strict()
    const parser = schema.safeParse(data)

    if (!parser.success) {
      return ctx.throw(datasetError('invalidRecordColumn', parser.error.formErrors))
    }

    await db(dataset.id)
      .model(model)
      .where('id', recordId)
      .update({
        ...parser.data,
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
    body: z.object({}).catchall(z.unknown()),
    response: {
      204: null
    }
  }
)
