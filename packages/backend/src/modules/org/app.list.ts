import { App } from 'backend/models/app'
import { Controller } from 'backend/server/controller'
import { serverError } from 'backend/server/server.error'
import { rNumId } from 'backend/utils/regex'
import { z } from 'zod'

export const listOrgApp = new Controller(
  async (ctx, next) => {
    const {
      access: { can, orgResource }
    } = ctx.state
    const { orgId } = ctx.params
    const { deny } = can('org:app:list', { orgId })

    if (deny) return ctx.throw(serverError('accessForbidden'))

    const apps = await App.query
      .select('*')
      .where('orgId', orgId)
      .whereIn('id', orgResource[orgId].appIds)
      .orderBy('id', 'desc')

    ctx.body = apps

    await next()
  },
  {
    state: ['auth', 'access'],
    params: z.object({
      orgId: z.string().regex(rNumId)
    }),
    response: {
      200: App.schema.pick({
        id: true,
        orgId: true,
        name: true,
        tintColor: true,
        icon: true
      }).array()
    }
  }
)
