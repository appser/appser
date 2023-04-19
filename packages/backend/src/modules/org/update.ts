import { Org } from 'backend/models/org'
import { Controller } from 'backend/server/controller'
import { serverError } from 'backend/server/server.error'
import { rNumId } from 'backend/utils/regex'
import { z } from 'zod'

export const updateOrg = new Controller(
  async (ctx, next) => {
    const {
      access: { can }
    } = ctx.state
    const { name } = ctx.request.body
    const { orgId } = ctx.params
    const { deny } = can('org:update', { orgId })

    if (deny) return ctx.throw(serverError('accessForbidden'))

    await Org.query.where('id', orgId).update({
      name,
      updatedAt: new Date().toISOString()
    })

    ctx.status = 204

    await next()
  },
  {
    state: ['auth', 'access'],
    params: z.object({
      orgId: z.string().regex(rNumId)
    }),
    body: z.object({
      name: z.string().trim().max(255)
    }),
    response: {
      204: null
    }
  }
)
