import { Dataset } from 'backend/models/dataset'
import { Controller } from 'backend/server/controller'
import { serverError } from 'backend/server/server.error'
import { rNumId } from 'backend/utils/regex'
import { z } from 'zod'

export const updateDataset = new Controller(
  async (ctx, next) => {
    const {
      access: { can },
      getDataset: { dataset: { appId } }
    } = ctx.state
    const { name } = ctx.request.body
    const { datasetId } = ctx.params
    const { deny } = can('app:dataset:update', { appId, datasetId })

    if (deny) return ctx.throw(serverError('accessForbidden'))

    await Dataset.query.where({ id: datasetId, appId }).update({
      name,
      updatedAt: new Date().toISOString()
    })

    ctx.status = 204

    await next()
  },
  {
    state: ['auth', 'access', 'getDataset'],
    params: z.object({
      datasetId: z.string().regex(rNumId)
    }),
    body: z.object({
      name: z.string().max(128).optional()
    }),
    response: {
      204: null
    }
  }
)
