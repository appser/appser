import db from 'core/db'
import { Dataset } from 'core/models/dataset'
import { fieldOptionSchema } from 'core/models/dataset/field.schema'
import { Controller } from 'core/server/controller'
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

    if (field.locked && (type || options)) return ctx.throw(datasetError('fieldIsLocked'))

    const config = Object.assign(field.toJSON(), {
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
