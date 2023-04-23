import { Role } from 'backend/models/role'
import { Controller } from 'backend/server/controller'
import { rNumId } from 'backend/utils/regex'
import { z } from 'zod'

import { listRoleByOrgId } from './utils/listRoleByOrgId'

export const listOrgRole = new Controller(
  async (ctx, next) => {
    const {
      access: { guard }
    } = ctx.state
    const { orgId } = ctx.params

    guard('org:role:list', { orgId })

    const roles = await listRoleByOrgId(orgId)

    ctx.body = roles

    await next()
  },
  {
    state: ['auth', 'access'],
    params: z.object({
      orgId: z.string().regex(rNumId)
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
