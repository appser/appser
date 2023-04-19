import { Org } from 'backend/models/org'
import { Controller } from 'backend/server/controller'
import { serverError } from 'backend/server/server.error'
import { rNumId } from 'backend/utils/regex'
import { z } from 'zod'

import type { TOrg } from 'backend/models/org'

export const getOrg = new Controller(
  async (ctx, next) => {
    const {
      access: { can }
    } = ctx.state
    const { orgId } = ctx.params
    const { deny } = can('org:get', { orgId })

    if (deny) return ctx.throw(serverError('accessForbidden'))

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

declare module 'backend/server/controller' {
  interface State {
    getOrg: {
      org: TOrg
    }
  }
}
