import { roles } from '@appser/access'
import { datasetIconIds, datasetTintColors } from '@appser/common'
import db from 'core/db'
import { App } from 'core/models/app'
import { Dataset } from 'core/models/dataset'
import { People, PersonStatus } from 'core/models/people'
import { Controller } from 'core/server/controller'
import { rNumId } from 'core/utils/regex'
import { z } from 'zod'

const randomTintColor = () => {
  return datasetTintColors[Math.floor(Math.random() * datasetTintColors.length)]
}

const randomIconId = () => {
  return datasetIconIds[Math.floor(Math.random() * datasetIconIds.length)]
}

export const createOrgApp = new Controller(
  async (ctx, next) => {
    const {
      access: { guard },
      auth: { currentUser: user }
    } = ctx.state
    const {
      name,
      tintColor = randomTintColor(),
      icon = randomIconId()
    } = ctx.request.body
    const { orgId } = ctx.params

    guard('org:app:create', { orgId })

    await db.transaction(async trx => {
      const [app] = await App.query
        .insert({
          orgId,
          name,
          tintColor,
          icon
        })
        .returning('*')
        .transacting(trx)

      await People.query
        .insert({
          orgId,
          appId: app.id,
          userId: user.id,
          roleId: roles.app.admin.id,
          status: PersonStatus.ACTIVE,
          inviterId: user.id,
          joinedAt: new Date().toISOString()
        })
        .transacting(trx)

      await Dataset.query
        .insert({
          appId: app.id
        })
        .returning('id')
        .transacting(trx)

      ctx.body = app
    })

    await next()
  },
  {
    state: ['auth', 'access'],
    params: z.object({
      orgId: z.string().regex(rNumId)
    }),
    body: z.object({
      name: z.string().max(128),
      tintColor: z.enum(datasetTintColors),
      icon: z.enum(datasetIconIds)
    }).partial(),
    response: {
      200: z.object({
        id: z.string(),
        orgId: z.string(),
        name: z.string().optional(),
        tintColor: z.string(),
        icon: z.string()
      })
    }
  }
)
