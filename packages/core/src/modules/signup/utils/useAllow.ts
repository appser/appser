import { parseInvitationToken } from 'core/modules/invitation/utils/invitationToken'
import { signupError } from 'core/modules/signup/signup.error'
import { Controller } from 'core/server/controller'
import { z } from 'zod'

import { getAllowSignup } from './getAllowSignup'

export const useAllow = new Controller(
  async (ctx, next) => {
    const { invitationToken } = ctx.request.body
    const allowSignup = await getAllowSignup(ctx)

    if (allowSignup === 'never') return ctx.throw(signupError('denySignup'))

    if (allowSignup === 'onlyByInvite') {
      if (!invitationToken) return ctx.throw(signupError('denySignup'))

      parseInvitationToken(invitationToken)
    }

    await next()
  },
  {
    body: z.object({
      invitationToken: z.string().optional().nullable()
    })
  }
)
