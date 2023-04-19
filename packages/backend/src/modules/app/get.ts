import { Dataset, unsafeViewSchema } from 'backend/models/dataset'
import { Controller } from 'backend/server/controller'
import { serverError } from 'backend/server/server.error'
import { rNumId } from 'backend/utils/regex'
import { z } from 'zod'

import { getAppById } from './utils/geAppById'

import type { TApp } from 'backend/models/app'

export const getApp = new Controller(
  async (ctx, next) => {
    const {
      access: { can }
    } = ctx.state
    const { appId } = ctx.params
    const { deny } = can('app:get', { appId })

    if (deny) return ctx.throw(serverError('accessForbidden'))

    const [app, datasets] = await Promise.all([
      getAppById(appId),
      Dataset.query
        .select('id', 'name', 'views')
        .where({ appId })
        .orderBy('createdAt', 'desc')
    ])

    ctx.body = Object.assign(app, { datasets })

    Object.assign(ctx.state, {
      getApp: {
        app
      }
    })

    await next()
  },
  {
    state: ['auth', 'access'],
    params: z.object({
      appId: z.string().regex(rNumId)
    }),
    response: {
      200: z.object({
        id: z.string(),
        name: z.string().optional(),
        tintColor: z.string(),
        icon: z.string(),
        orgId: z.string(),
        datasets: Dataset.schema.pick({
          id: true,
          name: true
        }).extend({
          views: unsafeViewSchema.pick({
            id: true,
            type: true,
            name: true
          }).array()
        }).array()
      })
    }
  }
)

declare module 'backend/server/controller' {
  interface State {
    getApp: {
      app: TApp
    }
  }
}
