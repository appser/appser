import db from 'backend/db'
import { Model } from 'backend/model'
import { Dataset } from 'backend/models/dataset'
import { Controller } from 'backend/server/controller'
import { rNumId } from 'backend/utils/regex'
import { z } from 'zod'

import { getDatasetById } from './utils/getDatasetById'

import type { TDataset } from 'backend/models/dataset'

export const getDataset = new Controller(
  async (ctx, next) => {
    const {
      access: { guard }
    } = ctx.state
    const { datasetId } = ctx.params
    const dataset = await getDatasetById(datasetId)

    guard('app:dataset:get', { appId: dataset.appId, datasetId })

    const recordModel = new Model(dataset.column)

    Object.assign(ctx.state, {
      getDataset: {
        dataset,
        recordModel
      }
    })

    ctx.body = dataset

    await next()
  },
  {
    state: ['auth', 'access'],
    params: z.object({
      datasetId: z.string().regex(rNumId)
    }),
    response: {
      200: Dataset.schema.required({
        createdAt: true,
        updatedAt: true
      }).omit({
        views: true
      })
    }
  }
)

declare module 'backend/server/controller' {
  interface State {
    getDataset: {
      dataset: TDataset
      recordModel: Model
    }
  }
}
