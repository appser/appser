import db from 'backend/db'
import { App } from 'backend/models/app'
import { Dataset } from 'backend/models/dataset'
import { Org } from 'backend/models/org'
import { People } from 'backend/models/people'
import { Controller } from 'backend/server/controller'
import { serverError } from 'backend/server/server.error'
import { rNumId } from 'backend/utils/regex'
import { z } from 'zod'

export const deleteOrg = new Controller(
  async (ctx, next) => {
    const {
      access: { can }
    } = ctx.state
    const { orgId } = ctx.params
    const { deny } = can('org:delete', { orgId })

    if (deny) return ctx.throw(serverError('accessForbidden'))

    await db.transaction(async trx => {
      await Org.query.where('id', orgId).delete().transacting(trx)
      await People.query.where('orgId', orgId).delete().transacting(trx)
      // remove apps
      const apps = await App.query.where('orgId', orgId).delete().returning('id').transacting(trx)
      const appIds = apps.map(b => b.id)
      // drop datasets
      const datasets = await Dataset.query.whereIn('appId', appIds).delete().returning('id').transacting(trx)
      const datasetIds = datasets.map(t => t.id)
      await Promise.all(datasetIds.map(datasetId => db.schema.dropTable(datasetId).transacting(trx)))
    })

    ctx.status = 204

    await next()
  },
  {
    state: ['auth', 'access'],
    params: z.object({
      orgId: z.string().regex(rNumId)
    }),
    response: {
      204: null
    }
  }
)
