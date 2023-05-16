import { Model } from 'core/db/model'
import { Dataset } from 'core/models/dataset'
import { DatasetField } from 'core/models/dataset/helpers/datasetField'
import { Record } from 'core/models/record'
import { Controller } from 'core/server/controller'
import { rNumId } from 'core/utils/regex'
import { merge } from 'lodash'
import { z } from 'zod'

import { getDatasetById } from './helpers/getDatasetById'
import { viewSchema } from './helpers/view/view.schema'

import type { TDataset } from 'core/models/dataset'
import type { DatasetFieldConfig } from 'core/models/dataset/field.schema'

export const defaultDatasetFields: Record<string, DatasetFieldConfig> = {
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
      data: DatasetField.toColumn(dataset.field)
    }).connect({ tableName: 'record' })

    Object.assign(ctx.state, {
      getDataset: {
        dataset,
        record: {
          model
        }
      }
    })

    dataset.field = merge(dataset.field, defaultDatasetFields)

    ctx.body = dataset

    await next()
  },
  {
    state: ['auth', 'access'],
    params: z.object({
      datasetId: z.string().regex(rNumId)
    }),
    response: {
      200: Dataset.schema.pick({
        id: true,
        appId: true,
        name: true,
        field: true,
        createdAt: true,
        updatedAt: true
      }).extend({
        views: viewSchema.pick({
          id: true,
          type: true,
          name: true
        }).array()
      })
    }
  }
)

declare module 'core/server/controller' {
  interface State {
    getDataset: {
      dataset: TDataset
      record: {
        model: typeof Record
      }
    }
  }
}
