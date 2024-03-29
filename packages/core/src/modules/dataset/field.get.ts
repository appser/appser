import { DatasetField } from 'core/models/dataset/helpers/datasetField'
import { Controller } from 'core/server/controller'
import { z } from 'zod'

import { datasetError } from './dataset.error'

export const getField = new Controller(
  async (ctx, next) => {
    const {
      access: { guard },
      getDataset: { dataset }
    } = ctx.state
    const { appId, id: datasetId } = dataset
    const { fieldName } = ctx.params

    guard('app:dataset:field:get', { appId, datasetId, fieldName })

    const config = dataset.field[fieldName]

    if (!config) return ctx.throw(datasetError('fieldNotFound'))

    const field = new DatasetField(fieldName, config)

    Object.assign(ctx.state, {
      getDatasetField: {
        field
      }
    })

    await next()
  },
  {
    state: ['auth', 'access', 'getDataset'],
    params: z.object({
      fieldName: z.string()
    })
  }
)

declare module 'core/server/controller' {
  interface State {
    getDatasetField: {
      field: DatasetField
    }
  }
}
