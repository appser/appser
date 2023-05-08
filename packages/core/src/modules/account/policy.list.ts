import { Controller } from 'core/server/controller'

export const listAccountPolicy = new Controller(
  (ctx, next) => {
    const {
      access: { ac }
    } = ctx.state

    ctx.body = ac.policies

    return next()
  },
  {
    state: ['access']
  }
)
