import { HttpStatusCode } from '@appser/shared'
import db from 'backend/db'
import { User } from 'backend/models/user'
import { Controller } from 'backend/server/controller'
import { compareSync, hashSync } from 'backend/vendors/bcrypt'
import { z } from 'zod'

import { accountError } from './account.error'

export const changeAccountPassword = new Controller(
  async (ctx, next) => {
    const {
      auth: { currentUser: user }
    } = ctx.state
    const { oldPwd, newPwd } = ctx.request.body

    if (user.account.password && !compareSync(oldPwd, user.account.password)) {
      ctx.throw(accountError('incorrectPassword'))
    }

    await User.query.where({ id: user.id }).update({
      // TODO: fix type error
      account: db.jsonSet('account', '$.password', JSON.stringify(hashSync(newPwd))) as never
    })

    ctx.status = HttpStatusCode.NotContent

    return next()
  },
  {
    state: ['auth'],
    body: z.object({
      oldPwd: z.string(),
      newPwd: z.string()
    }),
    response: {
      204: null
    }
  }
)
