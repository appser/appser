import { Controller } from 'backend/server/controller'
import { Token } from 'backend/models/token'

export const revokeToken = new Controller(
  async (ctx, next) => {
    const {
      token: { payload }
    } = ctx.state.auth

    await Token.query.insert({
      id: payload.jti,
      audience: payload.aud,
      isRevoke: true,
      expiredAt: new Date(payload.exp * 1000).toISOString()
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
