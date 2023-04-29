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
import type { TDatasetColumnConfig, TDatasetRecord } from 'backend/models/dataset/dataset.column.schema'
import type { State } from 'backend/server/controller'

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

    dataset.column = merge(dataset.column, defaultRecordConfigs)

    Object.assign(ctx.state, {
      getDataset: {
        dataset,
        column: {
          model: new Model<TDatasetRecord>(dataset.column),
          insertableColumns: pickInsertableColumns(dataset.column),
          updateableColumns: pickUpdateableColumns(dataset.column)
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
      column: {
        model: Model<TDatasetRecord>
        insertableColumns: Record<string, true>
        updateableColumns: Record<string, true>
      }
    }
  }
}
