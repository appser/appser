import { HttpStatusCode } from '@appser/common'
import db from 'core/db'
import { Dataset } from 'core/models/dataset'
import { viewSchema } from 'core/models/dataset/view.schema'
import { Controller } from 'core/server/controller'
import { z } from 'zod'

export const addView = new Controller(
  async (ctx, next) => {
    const {
      access: { guard },
      getDataset: { dataset }
    } = ctx.state
    const { appId, id: datasetId } = dataset
    const { name } = ctx.request.body

    guard('app:dataset:view:add', { appId, datasetId })

    const view = viewSchema.parse({ name })

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
