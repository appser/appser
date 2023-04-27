import db from 'backend/db'
import { Column } from 'backend/model/column'
import { castType } from 'backend/model/utils/cast'
import { Dataset } from 'backend/models/dataset'
import { Controller } from 'backend/server/controller'
import { z } from 'zod'

import { datasetError } from './dataset.error'

export const resetColumn = new Controller(
  async (ctx, next) => {
    const {
      access: { guard },
      getDataset: { recordModel: model, dataset },
      getDatasetColumn: { column }
    } = ctx.state
    const { appId, id: datasetId } = dataset
    const { title, options, field } = ctx.request.body

    guard('app:dataset:column:reset', { appId, datasetId, columnName: column.name })

    const name = column.name
    const legacyColumn = model.getColumn(name)

    if (legacyColumn.config.isLocked) return ctx.throw(datasetError('columnIsLocked'))

    const freshColumn = new Column(name, { field, title, options })
    const [sql, bindings] = castType({
      tableName: model.tableName,
      columnName: name,
      from: legacyColumn.field.baseType,
      to: freshColumn.field.baseType
    })

    await db.transaction(async trx => {
      dataset.column[name] = {
        title,
        options,
        field
      }

      await Dataset.query
        .where({ id: datasetId })
        .update('column', db.jsonSet('column', `$.${name}`, JSON.stringify(dataset.column[name])))
        .transacting(trx)

      if (legacyColumn.field.baseType !== freshColumn.field.baseType) {
        await db.schema.raw(db.raw(sql, bindings).toQuery()).transacting(trx)
      }
    })

    ctx.status = 204

    await next()
  },
  {
    state: ['auth', 'access', 'getDataset', 'getDatasetColumn'],
    body: z.object({
      title: z.string().max(50).optional(),
      field: z.any(),
      options: z.any()
    }),
    response: {
      204: null
    }
  }
)
