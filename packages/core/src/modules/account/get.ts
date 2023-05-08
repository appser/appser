import { User } from 'core/models/user'
import { Controller } from 'core/server/controller'

export const getAccount = new Controller(
  (ctx, next) => {
    const {
      auth: { currentUser: user }
    } = ctx.state

    ctx.body = {
      id: user.id,
      status: user.status,
      name: user.name,
      avatar: user.avatar,
      settings: user.settings
    }
    ctx.body = user

    return next()
  },
  {
    state: ['auth'],
    response: {
      200: User.schema.pick({
        id: true,
        status: true,
        name: true,
        avatar: true,
        settings: true
      })
    }
  }
)
