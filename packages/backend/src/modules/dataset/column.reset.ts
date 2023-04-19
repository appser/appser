import db from 'backend/db'
import { Column } from 'backend/model/column'
import { castAppType } from 'backend/model/utils/cast'
import { Dataset } from 'backend/models/dataset'
import { Controller } from 'backend/server/controller'
import { serverError } from 'backend/server/server.error'
import { z } from 'zod'

import { datasetError } from './dataset.error'

export const resetColumn = new Controller(
  async (ctx, next) => {
    const {
      access: { can },
      getDataset: { model, dataset },
      getDatasetColumn: { column }
    } = ctx.state
    const { appId, id: datasetId } = dataset
    const { title, options, field } = ctx.request.body
    const { deny } = can('app:dataset:column:reset', { appId, datasetId, columnName: column.name })

    if (deny) return ctx.throw(serverError('accessForbidden'))

    const name = column.name
    const legacyColumn = model.getColumn(name)

    if (legacyColumn.isLocked) return ctx.throw(datasetError('columnIsLocked'))

    const freshColumn = new Column(name, { field, title, options })
    const [sql, bindings] = castAppType({
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
