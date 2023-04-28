import { Record } from 'backend/models/record'
import { Controller } from 'backend/server/controller'
import jsonSchema from 'backend/utils/jsonSchema'
import { rNumId } from 'backend/utils/regex'
import { merge } from 'lodash'
import { z } from 'zod'

import { datasetError } from './dataset.error'

export const updateViewRecord = new Controller(
  async (ctx, next) => {
    const {
      auth: { currentUser },
      access: { guard },
      getDataset: { dataset, record: { model, updateableColumns } },
      getDatasetView: { view },
      getDatasetRecord: { record }
    } = ctx.state
    const { appId, id: datasetId } = dataset
    const { recordId } = ctx.params
    const { id: viewId } = view
    const data = ctx.request.body

    guard('app:dataset:view:record:column:update', { appId, datasetId, viewId, recordId, columnName: '*' })

    const parser = model.schema.pick(updateableColumns).strict().safeParse(data)

    if (!parser.success) return ctx.throw(datasetError('invalidRecord'))

    const extra = merge(parser.data, record.extra)

    await Record.query
      .where('id', recordId)
      .update({
        extra,
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
