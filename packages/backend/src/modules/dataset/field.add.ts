import db from 'backend/db'
import { Dataset } from 'backend/models/dataset'
import { fieldOptionSchema } from 'backend/models/dataset/field.schema'
import { Controller } from 'backend/server/controller'
import { nanoid } from 'nanoid'
import { z } from 'zod'

import { getViewFromDatasetById } from './helpers/getViewFromDatasetById'

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
      const { view, viewIndex } = getViewFromDatasetById(dataset, appendViewId)

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
