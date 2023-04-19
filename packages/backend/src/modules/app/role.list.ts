import { Role } from 'backend/models/role'
import { Controller } from 'backend/server/controller'
import { serverError } from 'backend/server/server.error'
import { rNumId } from 'backend/utils/regex'
import { z } from 'zod'

import { listRoleByAppId } from './utils/listRoleByAppId'

export const listAppRole = new Controller(
  async (ctx, next) => {
    const {
      access: { can }
    } = ctx.state
    const { appId } = ctx.params
    const { deny } = can('app:role:list', { appId })

    if (deny) return ctx.throw(serverError('accessForbidden'))

    const roles = await listRoleByAppId(appId)

    ctx.body = roles

    await next()
  },
  {
    state: ['auth', 'access'],
    params: z.object({
      appId: z.string().regex(rNumId)
    }),
    response: {
      200: Role.schema.pick({
        id: true,
        name: true,
        description: true
      }).array()
    }
  }
)
