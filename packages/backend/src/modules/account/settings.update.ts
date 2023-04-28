import { HttpStatusCode } from '@appser/shared'
import { User } from 'backend/models/user'
import { Controller } from 'backend/server/controller'
import merge from 'lodash/merge'

export const updateAccountSettings = new Controller(
  async (ctx, next) => {
    const {
      auth: { currentUser: user }
    } = ctx.state
    const { timezone, firstDayOfWeek } = ctx.request.body
    const settings = merge(user.settings, { timezone, firstDayOfWeek })

    await User.query.where({ id: user.id }).update('settings', settings)

    ctx.status = HttpStatusCode.NotContent

    return next()
  },
  {
    state: ['auth'],
    body: User.schema.shape.settings.unwrap(),
    response: {
      204: null
    }
  }
)
