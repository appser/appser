import { HttpStatusCode } from '@appser/shared'
import { User } from 'backend/models/user'
import { Controller } from 'backend/server/controller'
import { z } from 'zod'

export const updateAccountProfile = new Controller(
  async (ctx, next) => {
    const {
      auth: { currentUser: user }
    } = ctx.state
    const { name, avatar } = ctx.request.body

    await User.query.update({ name, avatar }).where({ id: user.id })

    ctx.status = HttpStatusCode.NotContent

    return next()
  },
  {
    state: ['auth'],
    body: z.object({
      name: z.string().min(1).max(255).trim(),
      avatar: z.string().url()
    }).partial(),
    response: {
      204: null
    }
  }
)
