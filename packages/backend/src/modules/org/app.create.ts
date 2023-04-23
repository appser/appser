import { roles } from '@appser/access'
import { datasetIconIds, datasetTintColors } from '@appser/shared'
import db from 'backend/db'
import { Model } from 'backend/model'
import { App } from 'backend/models/app'
import { Dataset } from 'backend/models/dataset'
import { People } from 'backend/models/people'
import { Controller } from 'backend/server/controller'
import { rNumId } from 'backend/utils/regex'
import { genSnowflakeId } from 'backend/vendors/snowflakeId'
import { z } from 'zod'

import { datasetDefaultColumn } from '../dataset/data/defaultColumn'
import { defaultView } from '../dataset/data/defaultView'

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
          status: 'active',
          inviterId: user.id,
          joinedAt: new Date().toISOString()
        })
        .transacting(trx)

      const [dataset] = await Dataset.query
        .insert({
          appId: app.id,
          column: datasetDefaultColumn,
          views: [
            {
              id: genSnowflakeId().toString(),
              ...defaultView
            }
          ]
        })
        .returning('id')
        .transacting(trx)

      await new Model(datasetDefaultColumn)
        .primary('id')
        .connect({
          db,
          table: dataset.id
        })
        .createTable()
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
