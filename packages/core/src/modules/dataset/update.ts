import { HttpStatusCode } from '@appser/common'
import { Dataset } from 'core/models/dataset'
import { Controller } from 'core/server/controller'
import { z } from 'zod'

export const updateDataset = new Controller(
  async (ctx, next) => {
    const {
      access: { guard },
      getDataset: { dataset: { id: datasetId, appId } }
    } = ctx.state
    const { name } = ctx.request.body

    guard('app:dataset:update', { appId, datasetId })

    await Dataset.query.where({ id: datasetId, appId }).update({
      name,
      updatedAt: new Date().toISOString()
    })

    ctx.status = HttpStatusCode.NotContent

    await next()
  },
  {
    state: ['auth', 'access', 'getDataset'],
    body: z.object({
      name: z.string().max(128).optional()
    }),
    response: {
      204: null
    }
  }
)
