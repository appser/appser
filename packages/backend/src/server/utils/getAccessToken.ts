import type { Context } from 'koa'

export function getAccessToken(ctx: Context) {
  const bearerToken = ctx.header.authorization?.match(/Bearer (.*)/)?.[1]
  const cookieToken = ctx.cookies.get('at')
  const token = bearerToken || cookieToken

  return token
}
