import db from 'backend/db'
import { Controller } from 'backend/server/controller'
import { serverError } from 'backend/server/server.error'
import { rNumId } from 'backend/utils/regex'
import { z } from 'zod'

import { datasetError } from './dataset.error'

export const getViewRecord = new Controller(
  async (ctx, next) => {
    const {
      access: { can },
      getDataset: { dataset, model },
      getDatasetView: { view }
    } = ctx.state
    const { appId, id: datasetId } = dataset
    const { id: viewId } = view
    const { recordId } = ctx.params
    const { deny } = can('app:dataset:view:record:get', { appId, datasetId, recordId, viewId })

    if (deny) return ctx.throw(serverError('accessForbidden'))
    const select = Object.keys(view.column)
    const record = await db(dataset.id).model(model).column(select).where({ id: recordId }).first()

    if (!record) return ctx.throw(datasetError('recordNotFound'))

    Object.assign(ctx.state, {
      getDatasetRecord: record
    })

    ctx.body = record

    await next()
  },
  {
    state: ['auth', 'access', 'getDataset', 'getDatasetView'],
    params: z.object({
      recordId: z.string().regex(rNumId)
    })
  }
)

declare module 'backend/server/controller' {
  interface State {
    getDatasetRecord: Record<string, unknown>
  }
}
