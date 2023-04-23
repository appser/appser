import db from 'backend/db'
import { Column } from 'backend/model/column'
import { publicFields } from 'backend/model/config'
import { Dataset } from 'backend/models/dataset'
import { Controller } from 'backend/server/controller'
import { customAlphabet } from 'nanoid'
import { z } from 'zod'

import { getViewFromDatasetById } from './utils/getViewFromDatasetById'

const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 8)

export const addColumn = new Controller(
  async (ctx, next) => {
    const {
      access: { guard },
      getDataset: { dataset }
    } = ctx.state
    const { appId, id: datasetId } = dataset
    const { title, field, options, associatedViewId } = ctx.request.body

    guard('app:dataset:column:add', { appId, datasetId })

    const name = `${field.charAt(0)}${field.charAt(1)}${nanoid()}`
    const column = new Column(name, {
      field: field as any,
      title,
      options
    })

    await db.transaction(async trx => {
      const query = Dataset.query
        .where({ id: datasetId })
        .update('column', db.jsonInsert('column', `$.${column.name}`, column.config))

      if (associatedViewId) {
        const { view, viewIndex } = getViewFromDatasetById(dataset, associatedViewId)

        view.column[name] = {
          selected: true
        }
        view.columns.push(name)

        query.update('views', db.jsonSet('views', `$.${viewIndex}`, JSON.stringify(view)))
      }

      await query.transacting(trx)

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
      associatedViewId: z.string().optional()
    }),
    response: {
      201: null
    }
  }
)
