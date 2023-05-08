import config from 'core/config'
import db from 'core/db'
import { Controller } from 'core/server/controller'
import { compareSync } from 'core/vendors/bcrypt'
import dayjs from 'dayjs'
import { z } from 'zod'

import { authError } from './auth.error'
import { createAccessToken } from './utils/accessToken'

export const authWithEmail = new Controller(
  async (ctx, next) => {
    const { email, password, setCookie } = ctx.request.body
    // Postgres only work, when using knex.whereJsonPath seems not hit GIN index.
    const user = await db('user')
      .select('account', 'id')
      .where('account', '@>', { email })
      .first()

    if (!user) return ctx.throw(authError('account.notMatch'))
    if (!user.account.password || !compareSync(password, user.account.password)) return ctx.throw(authError('account.notMatch'))

    const accessToken = createAccessToken({ audience: user.id, roleId: user.account.roleId })
    const expiredAt = dayjs()
      .add(...config.auth.accessTokenExpiresIn)
      .toDate()

    ctx.body = {
      accessToken,
      userId: user.id,
      roleId: user.account.roleId,
      expiredAt: expiredAt.valueOf().toString()
    }

    if (setCookie) {
      ctx.cookies.set('at', accessToken, {
        expires: expiredAt
      })
    }

    await next()
  },
  {
    body: z.object({
      email: z.string().trim().email().transform((v) => v.toLowerCase()),
      password: z.string().min(6),
      setCookie: z.boolean().optional()
    }),
    response: {
      200: z.object({
        accessToken: z.string(),
        userId: z.string(),
        roleId: z.string().optional(),
        expiredAt: z.string()
      })
    }
  }
)
