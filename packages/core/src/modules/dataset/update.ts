import { HttpStatusCode } from '@appser/common'
import { Dataset } from 'core/models/dataset'
import { Controller } from 'core/server/controller'
import { rNumId } from 'core/utils/regex'
import { z } from 'zod'

export const updateDataset = new Controller(
  async (ctx, next) => {
    const {
      access: { guard },
      getDataset: { dataset: { appId } }
    } = ctx.state
    const { name } = ctx.request.body
    const { datasetId } = ctx.params

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
