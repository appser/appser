import { Org } from 'core/models/org'
import { Controller } from 'core/server/controller'
import { serverError } from 'core/server/server.error'
import { rNumId } from 'core/utils/regex'
import { z } from 'zod'

import type { TOrg } from 'core/models/org'

export const getOrg = new Controller(
  async (ctx, next) => {
    const {
      access: { guard }
    } = ctx.state
    const { orgId } = ctx.params

    guard('org:get', { orgId })

    const org = await Org.query.select('*').where('id', orgId).first()

    if (!org) return ctx.throw(serverError('notFound'))

    ctx.body = org

    Object.assign(ctx.state, {
      getOrg: {
        org
      }
    })

    await next()
  },
  {
    state: ['auth', 'access'],
    params: z.object({
      orgId: z.string().regex(rNumId)
    }),
    response: {
      200: Org.schema.pick({
        id: true,
        name: true,
        image: true
      })
    }
  }
)

declare module 'core/server/controller' {
  interface State {
    getOrg: {
      org: TOrg
    }
  }
}
