import { Record } from 'backend/models/record'
import { Controller } from 'backend/server/controller'
import { rNumId } from 'backend/utils/regex'
import { z } from 'zod'

import { datasetError } from './dataset.error'

import type { TRecord } from 'backend/models/record'

export const getViewRecord = new Controller(
  async (ctx, next) => {
    const {
      access: { guard },
      getDataset: { dataset },
      getDatasetView: { view }
    } = ctx.state
    const { appId, id: datasetId } = dataset
    const { id: viewId } = view
    const { recordId } = ctx.params

    guard('app:dataset:view:record:get', { appId, datasetId, viewId, recordId })

    const selects = Object.keys(view.column).filter(column => view.column[column].selected)
    // TODO: bugfix selects
    const record = await Record.query.select(selects).where({
      datasetId: dataset.id,
      id: recordId
    }).first()

    if (!record) return ctx.throw(datasetError('recordNotFound'))

    Object.assign(ctx.state, {
      getDatasetRecord: {
        record
      }
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
    getDatasetRecord: {
      record: TRecord
    }
  }
}
