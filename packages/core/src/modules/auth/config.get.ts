import config, { configSchema } from 'core/config'
import db from 'core/db'
import { Controller } from 'core/server/controller'
import { z } from 'zod'

export const getAuthConfig = new Controller(
  async (ctx, next) => {
    const firstUser = await db('user').select('id').limit(1).first()
    const isInitialize = !!firstUser
    const providers = ['email']
    const signup = isInitialize ? config.signup.allow : 'always'
    const canForgotPassword = false

    ctx.body = {
      isInitialize,
      providers,
      signup,
      canForgotPassword
    }

    await next()
  },
  {
    response: {
      200: z.object({
        isInitialize: z.boolean(),
        providers: z.array(z.string()),
        signup: configSchema.shape.signup.shape.allow,
        canForgotPassword: z.boolean()
      })
    }
  }
)
