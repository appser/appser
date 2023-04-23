import db from 'backend/db'
import { columnConfigSchema } from 'backend/model/config'
import { Dataset } from 'backend/models/dataset'
import { Controller } from 'backend/server/controller'
import merge from 'lodash/merge'
import { z } from 'zod'

import { datasetError } from './dataset.error'

export const updateColumn = new Controller(
  async (ctx, next) => {
    const {
      access: { guard },
      getDataset: { dataset },
      getDatasetColumn: { column }
    } = ctx.state
    const { appId, id: datasetId } = dataset
    const { title, options } = ctx.request.body

    guard('app:dataset:column:update', { appId, datasetId, columnName: column.name })

    if (column.isLocked && options) return ctx.throw(datasetError('columnIsLocked'))

    const newColumnConfig = merge(column.config, { title, options })
    const parser = columnConfigSchema.safeParse(newColumnConfig)

    if (!parser.success) return ctx.throw(datasetError('invalidColumn', parser.error.formErrors))

    await Dataset.query
      .where({ id: datasetId, appId })
      .update('column', db.jsonSet('column', `$.${column.name}`, JSON.stringify(parser.data)))

    ctx.status = 204

    await next()
  },
  {
    state: ['auth', 'access', 'getDataset', 'getDatasetColumn'],
    body: z.object({
      title: z.string().max(50).trim().optional(),
      options: z.record(z.unknown())
    }).partial(),
    response: {
      204: null
    }
  }
)
