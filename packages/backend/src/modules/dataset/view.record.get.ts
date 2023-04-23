import db from 'backend/db'
import { Controller } from 'backend/server/controller'
import { rNumId } from 'backend/utils/regex'
import { z } from 'zod'

import { datasetError } from './dataset.error'

export const getViewRecord = new Controller(
  async (ctx, next) => {
    const {
      access: { guard },
      getDataset: { dataset, model },
      getDatasetView: { view }
    } = ctx.state
    const { appId, id: datasetId } = dataset
    const { id: viewId } = view
    const { recordId } = ctx.params

    guard('app:dataset:view:record:get', { appId, datasetId, recordId, viewId })

    const selects = Object.keys(view.column).filter(column => view.column[column].selected)
    const record = await db(dataset.id).model(model).column(selects).where({ id: recordId }).first()

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
