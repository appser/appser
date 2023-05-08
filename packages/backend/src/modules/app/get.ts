import { Dataset } from 'backend/models/dataset'
import { viewSchema } from 'backend/models/dataset/view.schema'
import { Controller } from 'backend/server/controller'
import { rNumId } from 'backend/utils/regex'
import { z } from 'zod'

import { getAppById } from './utils/geAppById'

import type { TApp } from 'backend/models/app'

export const getApp = new Controller(
  async (ctx, next) => {
    const {
      access: { guard }
    } = ctx.state
    const { appId } = ctx.params

    guard('app:get', { appId })

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
          views: viewSchema.pick({
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
