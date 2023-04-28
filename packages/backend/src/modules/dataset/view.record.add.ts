import { Record } from 'backend/models/record'
import { Controller } from 'backend/server/controller'
import jsonSchema from 'backend/utils/jsonSchema'

import { datasetError } from './dataset.error'

import type { TJson } from 'backend/utils/jsonSchema'

export const addViewRecord = new Controller(
  async (ctx, next) => {
    const {
      access: { guard },
      auth: { currentUser },
      getDataset: { dataset, recordModel },
      getDatasetView: { view }
    } = ctx.state
    const { appId, id: datasetId } = dataset
    const { id: viewId } = view
    const data = ctx.request.body

    guard('app:dataset:view:record:add', { appId, datasetId, viewId })

    const parser = recordModel.schema.safeParse(data)

    if (!parser.success) return ctx.throw(datasetError('invalidRecord'))

    await Record.query.insert({
      datasetId,
      extra: parser.data as TJson,
      // ...data, // TODO: omit private columns
      creator: currentUser.id,
      lastEditor: currentUser.id
    })

    ctx.status = 201

    await next()
  },
  {
    state: ['auth', 'access', 'getDataset', 'getDatasetView'],
    body: jsonSchema as any, // TODO: fix type
    response: {
      201: null
    }
  }
)
