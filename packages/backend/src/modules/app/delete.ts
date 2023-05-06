import db from 'backend/db'
import { App } from 'backend/models/App'
import { Dataset } from 'backend/models/dataset'
import { People } from 'backend/models/People'
import { Controller } from 'backend/server/controller'
import { rNumId } from 'backend/utils/regex'
import { z } from 'zod'

export const deleteApp = new Controller(
  async (ctx, next) => {
    const {
      access: { guard }
    } = ctx.state
    const { appId } = ctx.params

    guard('app:delete', { appId })

    await db.transaction(async trx => {
      const [app] = await App.query.where('id', appId).delete().returning('orgId').transacting(trx)
      await People
        .query
        .where({
          orgId: app.orgId,
          appId
        })
        .delete()
        .transacting(trx)
      // remove all data of the app
      const datasets = await Dataset.query.where('appId', appId).delete().returning('id').transacting(trx)
      await Promise.all(datasets.map(dataset => db.schema.dropTable(dataset.id).transacting(trx)))
    })

    ctx.status = 204

    await next()
  },
  {
    state: ['auth', 'access'],
    params: z.object({
      appId: z.string().regex(rNumId)
    })
  }
)
