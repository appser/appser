import db from 'core/db'
import { Dataset } from 'core/models/dataset'
import { fieldOptionSchema } from 'core/models/dataset/field.schema'
import { Controller } from 'core/server/controller'
import { customAlphabet } from 'nanoid'
import { z } from 'zod'

import { View } from './helpers/view/view'
const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 8)

export const addField = new Controller(
  async (ctx, next) => {
    const {
      access: { guard },
      getDataset: { dataset }
    } = ctx.state
    const { appId, id: datasetId } = dataset
    const { title, type, options, appendViewId } = ctx.request.body

    guard('app:dataset:field:add', { appId, datasetId })

    const name = nanoid(8)
    const config = {
      type,
      title,
      options
    }
    const query = Dataset.query
      .where({ id: datasetId })
      .update('field', db.jsonInsert('field', `$.${name}`, config))

    if (appendViewId) {
      const { view, viewIndex } = View.getById(dataset, appendViewId)

      view.field[name] = {
        selected: true
      }
      view.fields.push(name)

      query.update('views', db.jsonSet('views', `$.${viewIndex}`, JSON.stringify(view)))
    }

    await query

    ctx.status = 201

    await next()
  },
  {
    state: ['auth', 'access', 'getDataset'],
    body: fieldOptionSchema.and(z.object({
      title: z.string().max(128).optional(),
      appendViewId: z.string().optional()
    })),
    response: {
      201: null
    }
  }
)
