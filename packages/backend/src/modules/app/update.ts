import { HttpStatusCode, datasetIconIds, datasetTintColors } from '@appser/shared'
import { App } from 'backend/models/app'
import { Controller } from 'backend/server/controller'
import { serverError } from 'backend/server/server.error'
import { rNumId } from 'backend/utils/regex'
import { z } from 'zod'

export const updateApp = new Controller(
  async (ctx, next) => {
    const {
      access: { can }
    } = ctx.state
    const { appId } = ctx.params
    const { name, tintColor, icon } = ctx.request.body
    const { deny } = can('app:update', { appId })

    if (deny) return ctx.throw(serverError('accessForbidden'))

    await App.query
      .where('id', appId)
      .update({
        name,
        tintColor,
        icon,
        updatedAt: new Date().toISOString()
      })

    ctx.status = HttpStatusCode.NotContent

    await next()
  },
  {
    state: ['access'],
    params: z.object({
      appId: z.string().regex(rNumId)
    }),
    body: z.object({
      name: z.string().max(128),
      tintColor: z.enum(datasetTintColors),
      icon: z.enum(datasetIconIds)
    }).partial(),
    response: {
      204: null
    }
  }
)
