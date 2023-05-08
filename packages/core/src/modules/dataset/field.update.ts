import db from 'backend/db'
import { Dataset } from 'backend/models/dataset'
import { fieldOptionSchema } from 'backend/models/dataset/field.schema'
import { Controller } from 'backend/server/controller'
import merge from 'lodash/merge'
import { z } from 'zod'

import { datasetError } from './dataset.error'

export const updateField = new Controller(
  async (ctx, next) => {
    const {
      access: { guard },
      getDataset: { dataset },
      getDatasetField: { field }
    } = ctx.state
    const { appId, id: datasetId } = dataset
    const { title, type, options } = ctx.request.body

    guard('app:dataset:field:update', { appId, datasetId, fieldName: field.name })

    if (field.config.locked && (type || options)) return ctx.throw(datasetError('fieldIsLocked'))

    const config = merge(field.config, {
      type,
      options,
      title
    })

    // TODO: cast type
    // if (field.dataType !== updatedField.dataType) {
    //
    // }

    await Dataset.query
      .where({ id: datasetId, appId })
      .update('field', db.jsonSet('field', `$.${field.name}`, JSON.stringify(config)))

    ctx.status = 204

    await next()
  },
  {
    state: ['auth', 'access', 'getDataset', 'getDatasetField'],
    body: fieldOptionSchema.and(z.object({
      title: z.string().max(50).trim()
    }).partial()),
    response: {
      204: null
    }
  }
)