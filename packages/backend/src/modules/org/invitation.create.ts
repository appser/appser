import { Controller } from 'backend/server/controller'
import { serverError } from 'backend/server/server.error'
import { rNumId } from 'backend/utils/regex'
import { z } from 'zod'

import { checkRoleInOrg } from './utils/checkRoleInOrg'
import { createInvitationToken } from '../invitation/utils/invitationToken'

export const createOrgInvitation = new Controller(
  async (ctx, next) => {
    const {
      access: { can },
      auth: { currentUser: user }
    } = ctx.state
    const { orgId } = ctx.params
    const { roleId } = ctx.request.body
    const { deny } = can('org:invitation:create', { orgId })

    if (deny) return ctx.throw(serverError('accessForbidden'))

    await checkRoleInOrg({ roleId, orgId })

    ctx.body = {
      invitationToken: createInvitationToken({ roleId, orgId, issuer: user.id })
    }

    await next()
  },
  {
    state: ['auth', 'access'],
    params: z.object({
      orgId: z.string().regex(rNumId)
    }),
    body: z.object({
      roleId: z.string()
    }),
    response: {
      200: z.object({
        invitationToken: z.string()
      })
    }
  }
)
