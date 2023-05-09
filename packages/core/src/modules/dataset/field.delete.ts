import { Dataset } from 'core/models/dataset'
import { Controller } from 'core/server/controller'

import { datasetError } from './dataset.error'
import { View } from './helpers/view/view'

/**
 * TODO:
 * 1. Currently, we are using a soft delete method, but we will need to implement hard timed delete in the future.
 * 2. There are no ways to restore the deleted field, because the field metadata is permanently deleted.
 */
export const deleteField = new Controller(
  async (ctx, next) => {
    const {
      access: { guard },
      getDataset: { dataset },
      getDatasetField: { field }
    } = ctx.state
    const { appId, id: datasetId } = dataset
    const name = field.name

    guard('app:dataset:field:delete', { appId, datasetId, fieldName: name })

    if (field.locked) return ctx.throw(datasetError('fieldIsLocked'))

    dataset.fields[name].deletedAt = new Date().toISOString()
    dataset.views = dataset.views.map(view => new View(view).cleanField(name).toJSON())

    await Dataset.query
      .where({ id: datasetId })
      .update({
        fields: dataset.fields,
        views: dataset.views
      })

    ctx.status = 204

    await next()
  },
  {
    state: ['auth', 'access', 'getDataset', 'getDatasetField'],
    response: {
      204: null
    }
  }
)
