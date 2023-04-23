import { User } from 'backend/models/user'
import { Controller } from 'backend/server/controller'
import { rNumId } from 'backend/utils/regex'
import { z } from 'zod'

import { getUserById } from './utils/getUserById'

import type { TUser } from 'backend/models/user'

export const getUser = new Controller(
  async (ctx, next) => {
    const {
      access: { guard },
      auth: { currentUser }
    } = ctx.state
    const { userId } = ctx.request.query

    guard('account:user:get', { userId: currentUser.id })

    const user = await getUserById(userId, ctx)

    ctx.body = {
      id: user.id,
      status: user.status,
      name: user.name,
      avatar: user.avatar
    }

    Object.assign(ctx.state, {
      getUser: user
    })

    return next()
  },
  {
    state: ['auth', 'access'],
    params: z.object({
      userId: z.string().regex(rNumId)
    }),
    response: {
      200: User.schema.pick({
        id: true,
        status: true,
        name: true,
        avatar: true
      })
    }
  }
)

declare module 'backend/server/controller' {
  interface State {
    getUser: TUser
  }
}
