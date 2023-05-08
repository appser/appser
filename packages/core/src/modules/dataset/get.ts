import { Model } from 'core/model'
import { Dataset } from 'core/models/dataset'
import { Record } from 'core/models/record'
import { Controller } from 'core/server/controller'
import { rNumId } from 'core/utils/regex'
import { merge } from 'lodash'
import { z } from 'zod'

import { convertFieldsToColumn } from './helpers/convertFieldsToColumn'
import { getDatasetById } from './helpers/getDatasetById'

import type { TDataset } from 'core/models/dataset'
import type { FieldConfig } from 'core/models/dataset/field.schema'

export const defaultFields: Record<string, FieldConfig> = {
  id: { type: 'numId', locked: true },
  creator: { type: 'numId', required: true },
  lastEditor: { type: 'numId', locked: true },
  createdAt: { type: 'date', locked: true },
  updatedAt: { type: 'date', locked: true }
}

export const getDataset = new Controller(
  async (ctx, next) => {
    const {
      access: { guard }
    } = ctx.state
    const { datasetId } = ctx.params
    const dataset = await getDatasetById(datasetId)

    guard('app:dataset:get', { appId: dataset.appId, datasetId })

    const model = new Model({
      ...Record.columns,
      data: convertFieldsToColumn(dataset.fields)
    }).connect({ tableName: 'record' })

    Object.assign(ctx.state, {
      getDataset: {
        dataset,
        record: {
          model
        }
      }
    })

    dataset.fields = merge(dataset.fields, defaultFields)

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

declare module 'core/server/controller' {
  interface State {
    getDataset: {
      dataset: TDataset
      record: {
        model: Model
      }
    }
  }
}
