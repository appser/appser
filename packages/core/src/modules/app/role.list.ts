import { Role } from 'core/models/role'
import { Controller } from 'core/server/controller'
import { rNumId } from 'core/utils/regex'
import { z } from 'zod'

import { listRoleByAppId } from './utils/listRoleByAppId'

export const listAppRole = new Controller(
  async (ctx, next) => {
    const {
      access: { guard }
    } = ctx.state
    const { appId } = ctx.params

    guard('app:role:list', { appId })

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
