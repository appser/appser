import db from 'backend/db'
import { filterSchema } from 'backend/models/dataset/view.filter.schema'
import { viewSchema } from 'backend/models/dataset/view.schema'
import { Controller } from 'backend/server/controller'
import { z } from 'zod'

import { datasetError } from './dataset.error'

// TODO: pageToken
export const queryRecord = new Controller(
  async (ctx, next) => {
    const {
      access: { guard },
      getDataset: { dataset, model },
      getDatasetView: { view },
      formula: { userFormula }
    } = ctx.state
    const { appId, id: datasetId } = dataset
    const { id: viewId } = view
    const { pageToken: cursor = 0, filter, sorts, selects, pageSize = 50 } = ctx.request.body

    guard('app:dataset:view:record:query', { appId, datasetId, viewId })

    const viewSelects = Object.keys(view.column).filter(column => view.column[column].selected)

    if (selects && selects.some(s => !viewSelects.includes(s))) ctx.throw(datasetError('selectOutsideColumn'))

    const records = await db(dataset.id)
      .model(model)
      .limit(pageSize)
      .offset(cursor)
      .select([...new Set(['id', ...selects ?? viewSelects])]) // always select `id` column
      .filter(userFormula.parse(filter))
      .filter(userFormula.parse(view.filter))
      .sort(sorts ?? view.sorts)

    ctx.body = {
      records,
      pageToken: records.length === Number(pageSize) ? cursor + pageSize : undefined
    }

    await next()
  },
  {
    state: ['auth', 'formula', 'access', 'getDataset', 'getDatasetView'],
    body: z.object({
      filter: filterSchema,
      sorts: viewSchema.shape.sorts,
      selects: z.string().array().nonempty(),
      pageSize: z.number().int().max(100).default(50),
      pageToken: z.number().int().optional()
    }).partial(),
    response: {
      200: z.object({
        records: z.object({
          id: z.string()
        }).catchall(z.unknown()).array(),
        pageToken: z.number().int().optional()
      })
    }
  }
)
