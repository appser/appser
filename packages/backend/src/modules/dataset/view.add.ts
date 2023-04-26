import { HttpStatusCode } from '@appser/shared'
import db from 'backend/db'
import { Dataset } from 'backend/models/dataset'
import { Controller } from 'backend/server/controller'
import { genSnowflakeId } from 'backend/vendors/snowflakeId'
import { z } from 'zod'

import { defaultView } from './data/defaultView'

import type { TView } from 'backend/models/dataset/view.schema'

export const addView = new Controller(
  async (ctx, next) => {
    const {
      access: { guard },
      getDataset: { dataset }
    } = ctx.state
    const { appId, id: datasetId } = dataset
    const { name } = ctx.request.body

    guard('app:dataset:view:add', { appId, datasetId })

    const view: TView = {
      id: genSnowflakeId().toString(),
      name,
      ...defaultView
    }

    await Dataset.query
      .where({ id: datasetId })
      .update('views', db.jsonInsert('views', '$.99999', JSON.stringify(view)))

    ctx.status = HttpStatusCode.Created

    await next()
  },
  {
    state: ['auth', 'access', 'getDataset'],
    body: z.object({
      name: z.string().max(50).trim().optional()
    }),
    response: {
      201: null
    }
  }
)
