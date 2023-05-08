import { Org } from 'backend/models/org'
import { User } from 'backend/models/user'
import { Controller } from 'backend/server/controller'
import { getAccessToken } from 'backend/server/utils/getAccessToken'
import { z } from 'zod'

import { invitationError } from './invitation.error'
import { parseInvitationToken } from './utils/invitationToken'
import { parseAccessToken } from '../auth/utils/accessToken'

export const getInvitation = new Controller(
  async (ctx, next) => {
    const { invitationToken } = ctx.request.query
    const payload = parseInvitationToken(invitationToken)
    const accessToken = getAccessToken(ctx)
    const [inviter, org] = await Promise.all([
      User.query.where({ id: payload.iss }).select('id', 'name', 'avatar').first(),
      payload.wid ? Org.query.where({ id: payload.wid }).select('id', 'name').first() : null
    ])

    if (!inviter) return ctx.throw(invitationError('invalidInviter'))

    ctx.body = {
      inviter,
      org
    }

    if (accessToken) {
      const tokenPayload = parseAccessToken(accessToken)
      const currentUser = await User.query.where({ id: tokenPayload.aud }).select('id', 'name', 'avatar').first()
      ctx.body.currentUser = currentUser
    }

    await next()
  },
  {
    query: z.object({
      invitationToken: z.string()
    }),
    response: {
      200: z.object({
        inviter: User.schema.pick({
          id: true,
          name: true,
          avatar: true
        }),
        currentUser: User.schema.pick({
          id: true,
          name: true,
          avatar: true
        }).optional(),
        org: Org.schema.pick({
          id: true,
          name: true
        }).optional().nullable()
      })
    }
  }
)
