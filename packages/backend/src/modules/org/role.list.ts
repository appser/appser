import { Role } from 'backend/models/role'
import { Controller } from 'backend/server/controller'
import { serverError } from 'backend/server/server.error'
import { rNumId } from 'backend/utils/regex'
import { z } from 'zod'

import { listRoleByOrgId } from './utils/listRoleByOrgId'

export const listOrgRole = new Controller(
  async (ctx, next) => {
    const {
      access: { can }
    } = ctx.state
    const { orgId } = ctx.params
    const { deny } = can('org:role:list', { orgId })

    if (deny) {
      return ctx.throw(serverError('accessForbidden'))
    }

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
