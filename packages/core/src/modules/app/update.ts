import { HttpStatusCode, datasetIconIds, datasetTintColors } from '@appser/common'
import { App } from 'core/models/app'
import { Controller } from 'core/server/controller'
import { rNumId } from 'core/utils/regex'
import { z } from 'zod'

export const updateApp = new Controller(
  async (ctx, next) => {
    const {
      access: { guard }
    } = ctx.state
    const { appId } = ctx.params
    const { name, tintColor, icon } = ctx.request.body

    guard('app:update', { appId })

    await App.query
      .where('id', appId)
      .update({
        name,
        tintColor,
        icon,
        updatedAt: new Date()
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
