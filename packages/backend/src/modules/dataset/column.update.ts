import db from 'backend/db'
import { FieldColumn } from 'backend/model/column'
import { publicFieldTypes } from 'backend/model/fields'
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
    const { title, field: fieldType, options } = ctx.request.body

    guard('app:dataset:column:update', { appId, datasetId, columnName: column.name })

    if (column.config.locked && (fieldType || options)) return ctx.throw(datasetError('columnIsLocked'))

    const updatedColumn = new FieldColumn(column.name, merge(column.config, { title, field: fieldType, options }))

    // TODO: cast type
    if (column.dataType !== updatedColumn.dataType) {
      console.log(fieldType)
      //
    }

    await Dataset.query
      .where({ id: datasetId, appId })
      .update('column', db.jsonSet('column', `$.${column.name}`, JSON.stringify(updatedColumn.config)))

    ctx.status = 204

    await next()
  },
  {
    state: ['auth', 'access', 'getDataset', 'getDatasetColumn'],
    body: z.object({
      title: z.string().max(50).trim(),
      field: z.enum(publicFieldTypes),
      options: z.unknown()
    }).partial(),
    response: {
      204: null
    }
  }
)
