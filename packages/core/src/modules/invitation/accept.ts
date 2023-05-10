import { PersonStatus } from '@appser/common'
import { Org } from 'core/models/org'
import { People } from 'core/models/people'
import { checkRoleInOrg } from 'core/modules/org/utils/checkRoleInOrg'
import { Controller } from 'core/server/controller'
import { z } from 'zod'

import { invitationError } from './invitation.error'
import { parseInvitationToken } from './utils/invitationToken'
import { orgError } from '../org/org.error'

export const acceptInvitation = new Controller(
  async (ctx, next) => {
    const {
      auth: { currentUser: user }
    } = ctx.state
    const { invitationToken } = ctx.request.body
    const payload = parseInvitationToken(invitationToken)
    const { rol: roleId, wid: orgId } = payload

    // TODO accept invitation to dataset

    // accept invitation to org
    if (orgId) {
      await checkRoleInOrg({ roleId, orgId })

      const org = await Org.query.where({ id: orgId }).first()

      if (!org) return ctx.throw(orgError('notFound'))

      const people = await People.query.where({
        orgId,
        appId: '0',
        userId: user.id
      }).first()

      if (people) return ctx.throw(invitationError('alreadyJoined'))

      await People.query.insert({
        orgId,
        appId: '0',
        userId: user.id,
        roleId,
        status: PersonStatus.ACTIVE,
        inviterId: payload.iss,
        joinedAt: new Date()
      })
    }

    ctx.status = 204

    await next()
  },
  {
    state: ['auth', 'access'],
    body: z.object({
      invitationToken: z.string()
    }),
    response: {
      204: null
    }
  }
)
