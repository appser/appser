import { Token } from 'core/models/token'
import { User } from 'core/models/user'
import { authError } from 'core/modules/auth/auth.error'
import { parseAccessToken } from 'core/modules/auth/utils/accessToken'

import { getAccessToken } from '../utils/getAccessToken'

import type { TUser } from 'core/models/user'
import type { Payload } from 'core/modules/auth/utils/accessToken'
import type { Middleware } from 'koa'

export const useAuth: Middleware = async (ctx, next) => {
  const token = getAccessToken(ctx)

  if (!token) return ctx.throw(authError('token.notFound'))

  const tokenPayload = parseAccessToken(token)
  // check if token is revoked
  const unavailableToken = await Token.query
    .where({ id: tokenPayload.jti, isRevoke: true })
    .first()

  if (unavailableToken) return ctx.throw(authError('token.revoked'))

  // find current user
  const user = await User.query.where({ id: tokenPayload.aud }).first()

  if (!user) return ctx.throw(authError('account.notFound'))

  Object.assign(ctx.state, {
    auth: {
      token: {
        data: token,
        payload: tokenPayload
      },
      currentUser: user
    }
  })

  ctx.log.debug('auth user', user)

  await next()
}

declare module 'core/server/controller' {
  interface State {
    auth: {
      currentUser: TUser
      token: {
        data: string
        payload: Payload
      }
    }
  }
}
