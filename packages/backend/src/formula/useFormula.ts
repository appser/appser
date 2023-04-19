import { Controller } from 'backend/server/controller'

import { Formula } from '.'

export const useFormula = new Controller(
  (ctx, next) => {
    const {
      auth: { currentUser: user }
    } = ctx.state

    const formula = new Formula({
      tz: user.settings?.timezone,
      firstDayOfWeek: user.settings?.firstDayOfWeek
    })

    Object.assign(ctx.state, {
      formula
    })

    return next()
  },
  {
    state: ['auth']
  }
)

declare module 'backend/server/controller' {
  interface State {
    formula: Formula
  }
}
