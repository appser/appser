import db from 'core/db'
import { App } from 'core/models/app'
import { Dataset } from 'core/models/dataset'
import { Org } from 'core/models/org'
import { People } from 'core/models/people'
import { Record } from 'core/models/record'
import { Controller } from 'core/server/controller'
import { rNumId } from 'core/utils/regex'
import { z } from 'zod'

export const deleteOrg = new Controller(
  async (ctx, next) => {
    const {
      access: { guard }
    } = ctx.state
    const { orgId } = ctx.params

    guard('org:delete', { orgId })

    await db.transaction(async trx => {
      await Org.query.where('id', orgId).delete().transacting(trx)
      await People.query.where('orgId', orgId).delete().transacting(trx)
      // remove apps
      const apps = await App.query.where('orgId', orgId).delete().returning('id').transacting(trx)
      const appIds = apps.map(b => b.id)
      // drop datasets
      const datasets = await Dataset.query.whereIn('appId', appIds).delete().returning('id').transacting(trx)
      const datasetIds = datasets.map(t => t.id)
      await Record.query.whereIn('datasetId', datasetIds).delete().transacting(trx)
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
