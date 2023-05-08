import { User } from 'backend/models/user'
import { signupError } from 'backend/modules/signup/signup.error'
import { Controller } from 'backend/server/controller'
import { z } from 'zod'

export const signupWithEmail = new Controller(
  async (ctx, next) => {
    const { email, password, name } = ctx.request.body
    const existUser = await User.query.where('account', '@>', { email }).first()

    if (existUser) return ctx.throw(signupError('userExist'))

    // TODO improve otp
    // if create first user, didn't need to verify otp
    /*
    const firstUser = await ctx.model('user').first()
    if (firstUser && !otp) return ctx.throw()
    */

    const [user] = await User.query
      .insert({
        name,
        account: {
          email,
          password
        }
      })
      .returning(['id', 'name'])

    ctx.body = user

    await next()
  },
  {
    body: z.object({
      email: z.string().email().trim().transform((v) => v.toLowerCase()),
      password: z.string().min(6),
      name: z.string().max(128)
    }),
    response: {
      200: z.object({
        id: z.string(),
        name: z.string().optional()
      })
    }
  }
)
