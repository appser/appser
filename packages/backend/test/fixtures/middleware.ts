import type { Context, Next } from 'koa'

export const baseKrm = (ctx: Context, next: Next) => {
  return next()
}
