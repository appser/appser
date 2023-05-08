import { Controller } from 'core/server/controller'
import { serverError } from 'core/server/server.error'
import { rNumId } from 'core/utils/regex'
import { z } from 'zod'

import { checkRoleInOrg } from './utils/checkRoleInOrg'
import { createInvitationToken } from '../invitation/utils/invitationToken'

export const createOrgInvitation = new Controller(
  async (ctx, next) => {
    const {
      access: { guard },
      auth: { currentUser: user }
    } = ctx.state
    const { orgId } = ctx.params
    const { roleId } = ctx.request.body

    guard('org:invitation:create', { orgId })

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
