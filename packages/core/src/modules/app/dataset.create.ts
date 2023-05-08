import { Dataset } from 'backend/models/dataset'
import { Controller } from 'backend/server/controller'
import { rNumId } from 'backend/utils/regex'
import { z } from 'zod'

export const createAppDataset = new Controller(
  async (ctx, next) => {
    const {
      access: { guard }
    } = ctx.state
    const { appId } = ctx.params

    guard('app:dataset:create', { appId })

    await Dataset.query.insert({
      appId
    }).returning('id')

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
