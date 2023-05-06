import { User } from 'backend/models/User'

import { userError } from '../user.error'

import type { Context } from 'koa'

export async function getUserById(id: string, ctx: Context) {
  const user = await User.query.where({ id }).first()

  if (!user) return ctx.throw(userError('notFound'))

  return user
}
