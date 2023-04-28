import { Model } from 'backend/model'
import { Dataset } from 'backend/models/dataset'
import { publicRecordColumns } from 'backend/models/record'
import { Controller } from 'backend/server/controller'
import { rNumId } from 'backend/utils/regex'
import { merge } from 'lodash'
import { z } from 'zod'

import { getDatasetById } from './utils/getDatasetById'
import { pickInsertableColumns } from './utils/pickInsertableColumns'
import { pickUpdateableColumns } from './utils/pickUpdateableColumns'

import type { TDataset } from 'backend/models/dataset'
import type { TDatasetColumnConfig, TDatasetRecord } from 'backend/models/dataset/dataset.record.schema'

export const getDataset = new Controller(
  async (ctx, next) => {
    const {
      access: { guard }
    } = ctx.state
    const { datasetId } = ctx.params
    const dataset = await getDatasetById(datasetId)

    guard('app:dataset:get', { appId: dataset.appId, datasetId })

    const defaultRecordConfigs = Object.entries(publicRecordColumns).reduce((acc, [name, config]) => {
      acc[name] = {
        ...config,
        locked: true
      }

      return acc
    }, {} as Record<string, TDatasetColumnConfig>)

    dataset.record = merge(dataset.record, defaultRecordConfigs)

    Object.assign(ctx.state, {
      getDataset: {
        dataset,
        record: {
          model: new Model<TDatasetRecord>(dataset.record),
          insertableColumns: pickInsertableColumns(dataset.record),
          updateableColumns: pickUpdateableColumns(dataset.record)
        }
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
      record: {
        model: Model<TDatasetRecord>
        insertableColumns: Record<string, true>
        updateableColumns: Record<string, true>
      }
    }
  }
}
