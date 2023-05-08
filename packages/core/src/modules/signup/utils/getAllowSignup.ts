import config from 'core/config'
import db from 'core/db'

import type { Context } from 'koa'

export async function getAllowSignup(ctx: Context) {
  const firstUser = await db('user').select('id').limit(1).first()
  const isInitialize = !!firstUser

  return isInitialize ? config.signup.allow : 'always'
}
