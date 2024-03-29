import { HttpStatusCode } from '@appser/common'
import { Record } from 'core/models/record'
import { Controller } from 'core/server/controller'
import { rNumId } from 'core/utils/regex'
import { z } from 'zod'

export const deleteRecord = new Controller(
  async (ctx, next) => {
    const {
      access: { guard },
      getDataset: { dataset }
    } = ctx.state
    const appId = dataset.appId
    const { datasetId, recordId } = ctx.params

    guard('app:dataset:record:delete', { appId, datasetId, recordId })

    await Record.query.delete().where({ id: recordId })

    ctx.status = HttpStatusCode.NotContent

    await next()
  },
  {
    state: ['auth', 'access', 'getDataset'],
    params: z.object({
      datasetId: z.string().regex(rNumId),
      recordId: z.string().regex(rNumId)
    })
  }
)
