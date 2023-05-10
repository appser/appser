import { Token } from 'core/models/token'
import { Controller } from 'core/server/controller'

export const revokeToken = new Controller(
  async (ctx, next) => {
    const {
      token: { payload }
    } = ctx.state.auth

    await Token.query.insert({
      id: payload.jti,
      audience: payload.aud,
      isRevoke: true,
      expiredAt: new Date(payload.exp * 1000)
    })

    ctx.status = 204
    ctx.cookies.set('at', null)

    await next()
  },
  {
    state: ['auth'],
    response: {
      204: null
    }
  }
)
