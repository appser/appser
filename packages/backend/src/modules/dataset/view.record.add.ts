import db from 'backend/db'
import { datasetError } from 'backend/modules/dataset/dataset.error'
import { Controller } from 'backend/server/controller'
import { serverError } from 'backend/server/server.error'
import { z } from 'zod'

export const addViewRecord = new Controller(
  async (ctx, next) => {
    const {
      access: { can },
      auth: { currentUser },
      getDataset: { dataset, model },
      getDatasetView: { view }
    } = ctx.state
    const { appId, id: datasetId } = dataset
    const { id: viewId } = view
    const data = ctx.request.body
    const { deny } = can('app:dataset:view:record:add', { appId, datasetId, viewId })

    if (deny) return ctx.throw(serverError('accessForbidden'))

    const pickColumn = Object
      .entries(model.columns)
      .reduce<Record<string, true>>((acc, [name, column]) => {
        if (!column.isLocked && name in view.column) {
          acc[name] = true
        }

        return acc
      }, {})
    const schema = model.schema.pick(pickColumn).strict()
    const parser = schema.safeParse(data)

    if (!parser.success) {
      return ctx.throw(datasetError('invalidRecordColumn', parser.error.formErrors))
    }

    await db(dataset.id).model(model).insert({
      ...parser.data,
      creator: currentUser.id,
      lastEditor: currentUser.id
    })

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
