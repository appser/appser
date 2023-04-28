import db from 'backend/db'
import { FieldColumn } from 'backend/model/column'
import { publicFieldTypes } from 'backend/model/fields'
import { Dataset } from 'backend/models/dataset'
import { Controller } from 'backend/server/controller'
import { nanoid } from 'nanoid'
import { z } from 'zod'

import { getViewFromDatasetById } from './utils/getViewFromDatasetById'

export const addColumn = new Controller(
  async (ctx, next) => {
    const {
      access: { guard },
      getDataset: { dataset }
    } = ctx.state
    const { appId, id: datasetId } = dataset
    const { title, field, options, appendViewId } = ctx.request.body

    guard('app:dataset:column:add', { appId, datasetId })

    const name = nanoid(8)
    const column = new FieldColumn(name, {
      field: field as any,
      title,
      options
    })

    const query = Dataset.query
      .where({ id: datasetId })
      .update('column', db.jsonInsert('column', `$.${column.name}`, column.config))

    if (appendViewId) {
      const { view, viewIndex } = getViewFromDatasetById(appendViewId, dataset)

      view.column[name] = {
        selected: true
      }
      view.columns.push(name)

      query.update('views', db.jsonSet('views', `$.${viewIndex}`, JSON.stringify(view)))
    }

    await query

    ctx.status = 201

    await next()
  },
  {
    state: ['auth', 'access', 'getDataset'],
    body: z.object({
      title: z.string().max(128).optional(),
      field: z.enum(publicFieldTypes),
      options: z.record(z.unknown()).optional(),
      appendViewId: z.string().optional()
    }),
    response: {
      201: null
    }
  }
)
