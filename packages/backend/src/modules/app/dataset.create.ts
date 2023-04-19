import db from 'backend/db'
import { Model } from 'backend/model'
import { Dataset } from 'backend/models/dataset'
import { Controller } from 'backend/server/controller'
import { serverError } from 'backend/server/server.error'
import { rNumId } from 'backend/utils/regex'
import { genSnowflakeId } from 'backend/vendors/snowflakeId'
import { z } from 'zod'

import { datasetDefaultColumn } from '../dataset/data/defaultColumn'
import { defaultView } from '../dataset/data/defaultView'

export const createAppDataset = new Controller(
  async (ctx, next) => {
    const {
      access: { can }
    } = ctx.state
    const { appId } = ctx.params
    const { deny } = can('app:dataset:create', { appId })

    if (deny) return ctx.throw(serverError('accessForbidden'))

    await db.transaction(async trx => {
      const [dataset] = await Dataset.query
        .insert({
          appId,
          column: datasetDefaultColumn,
          views: [
            {
              id: genSnowflakeId().toString(),
              ...defaultView
            }
          ]
        })
        .returning('id')
        .transacting(trx)

      await new Model(datasetDefaultColumn)
        .primary('id')
        .connect({
          db,
          table: dataset.id
        })
        .createTable()
        .transacting(trx)
    })

    ctx.status = 201

    await next()
  },
  {
    state: ['auth', 'access'],
    params: z.object({
      appId: z.string().regex(rNumId)
    }),
    response: {
      201: null
    }
  }
)
