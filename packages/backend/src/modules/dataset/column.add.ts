import db from 'backend/db'
import { Column } from 'backend/model/column'
import { publicFields } from 'backend/model/config'
import { Dataset } from 'backend/models/dataset'
import { Controller } from 'backend/server/controller'
import { serverError } from 'backend/server/server.error'
import { PositionObject } from 'backend/utils/positionObject'
import { rNumId } from 'backend/utils/regex'
import { customAlphabet } from 'nanoid'
import { z } from 'zod'

const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 8)

export const addColumn = new Controller(
  async (ctx, next) => {
    const {
      access: { can },
      getDataset: { dataset }
    } = ctx.state
    const { appId, id: datasetId } = dataset
    const { title, field, options, currentViewId } = ctx.request.body
    const { deny } = can('app:dataset:column:add', { appId, datasetId })

    if (deny) return ctx.throw(serverError('accessForbidden'))

    const name = `${field.charAt(0)}${field.charAt(1)}${nanoid()}`
    const column = new Column(name, {
      field: field as never,
      title,
      options
    })

    await db.transaction(async trx => {
      const updater = Dataset.query
        .where({ id: datasetId })
        .update('column', db.jsonInsert('column', `$.${column.name}`, column.config))
      const viewIndex = currentViewId ? dataset.views.findIndex(v => v.id === currentViewId) : -1

      // add column to current view
      if (viewIndex >= 0) {
        const column = new PositionObject(dataset.views[viewIndex].column)
        column.add(name, {
          selected: true
        })
        updater.update('views', db.jsonSet('views', `$.${viewIndex}.column`, JSON.stringify(column.toObject())))
      }

      await updater.transacting(trx)
      await db.schema
        .alterTable(datasetId, t => {
          t[column.field.baseType](column.name)
        })
        .transacting(trx)
    })

    ctx.status = 201

    await next()
  },
  {
    state: ['auth', 'access', 'getDataset'],
    body: z.object({
      title: z.string().max(128).optional(),
      field: z.enum(publicFields),
      options: z.object({}).catchall(z.unknown()).optional(),
      currentViewId: z.string().regex(rNumId).optional()
    }),
    response: {
      201: null
    }
  }
)
