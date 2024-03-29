import { Record } from 'core/models/record'
import { Controller } from 'core/server/controller'
import { rNumId } from 'core/utils/regex'
import { z } from 'zod'

import { datasetError } from './dataset.error'

import type { TRecord } from 'core/models/record'

export const getViewRecord = new Controller(
  async (ctx, next) => {
    const {
      access: { guard },
      getDataset: { dataset },
      getDatasetView: { view }
    } = ctx.state
    const { appId, id: datasetId } = dataset
    const { id: viewId } = view.toJSON()
    const { recordId } = ctx.params

    guard('app:dataset:view:record:get', { appId, datasetId, viewId, recordId })

    const record = await Record.query
      .where({
        datasetId: dataset.id,
        id: recordId
      })
      .select(view.toSelectQuery())
      .select('id') // always select id column
      .first()

    if (!record) return ctx.throw(datasetError('recordNotFound'))

    Object.assign(ctx.state, {
      getDatasetViewRecord: {
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

declare module 'core/server/controller' {
  interface State {
    getDatasetRecord: {
      record: TRecord
    }
  }
}
