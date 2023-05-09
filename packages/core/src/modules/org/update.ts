import { Org } from 'core/models/org'
import { Controller } from 'core/server/controller'
import { rNumId } from 'core/utils/regex'
import { z } from 'zod'

export const updateOrg = new Controller(
  async (ctx, next) => {
    const {
      access: { guard }
    } = ctx.state
    const { name } = ctx.request.body
    const { orgId } = ctx.params

    guard('org:update', { orgId })

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
