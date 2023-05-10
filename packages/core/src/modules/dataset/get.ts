import db from 'core/db'
import { Model } from 'core/db/model'
import { Dataset } from 'core/models/dataset'
import { Record } from 'core/models/record'
import { Controller } from 'core/server/controller'
import { rNumId } from 'core/utils/regex'
import { merge } from 'lodash'
import { z } from 'zod'

import { Field } from './helpers/field/field'
import { getDatasetById } from './helpers/getDatasetById'
import { viewSchema } from './helpers/view/view.schema'

import type { FieldConfig } from './helpers/field/field.schema'
import type { TDataset } from 'core/models/dataset'

export const defaultDatasetFields: Record<string, FieldConfig> = {
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
      data: Field.toColumnWithFields(dataset.field)
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
        model: Model
      }
    }
  }
}
