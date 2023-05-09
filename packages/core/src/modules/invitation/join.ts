/**
 * TODO: Message modules, outside collaborators.
 * NOW:
 * 2. No confirmation required.
 */
import { PersonStatus } from 'core/models/people'
import { checkRoleInApp } from 'core/modules/app/utils/checkRoleInApp'
import { Controller } from 'core/server/controller'
import { serverError } from 'core/server/server.error'
import { rNumId } from 'core/utils/regex'
import { z } from 'zod'

import { invitationError } from './invitation.error'
import { getUserById } from '../user/utils/getUserById'

/*
export const inviteToApp = new Module(
  async (ctx, next) => {
    const {
      access: { can },
      auth: { currentUser }
    } = ctx.state
    const { roleId, appId, userId } = ctx.request.body
    const { deny } = can('app:people:invite', { appId })

    if (deny) return ctx.throw(serverError('accessForbidden'))
    if (!await isAvailableRoleInApp({ roleId, appId }, ctx)) ctx.throw(inviteError('unavailableRole'))

    const [user, dataset] = await Promise.all([
      getUserById(userId, ctx),
      getAppById(appId, ctx)
    ])

    await ctx.model('people').insert({
      orgId: app.orgId,
      appId: app.id,
      userId: user.id,
      roleId,
      status: PeopleStatus.ACTIVE,
      inviterId: currentUser.id,
      joinedAt: new Date().toISOString()
    })

    ctx.status = 204

    await next()
  },
  {
    state: ['auth', 'access'],
    body: z.object({
      roleId: z.string(),
      userId: z.string().regex(rNumId),
      appId: z.string().regex(rNumId)
    }),
    response: {
      204: null
    },
    openapi: {
      tags: 'invite',
      operationId: 'inviteToApp'
    }
  }
)

*/
