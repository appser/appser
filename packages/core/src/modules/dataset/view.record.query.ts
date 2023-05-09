import { Controller } from 'core/server/controller'
import { z } from 'zod'

import { viewSchema } from './helpers/view/view.schema'
import { filterSchema } from '../../db/filter/filter.schema'

// TODO: pageToken
export const queryRecord = new Controller(
  async (ctx, next) => {
    const {
      access: { guard },
      getDataset: { dataset, record: { model } },
      getDatasetView: { view },
      formula: { userFormula }
    } = ctx.state
    const { appId, id: datasetId } = dataset
    const { id: viewId } = view.toJSON()
    const { pageToken: cursor = 0, filter, sorts, selects, pageSize = 50 } = ctx.request.body

    guard('app:dataset:view:record:query', { appId, datasetId, viewId })

    view.validate({ filter, sorts, fields: selects })

    const records = await model.query
      .select(view.toSelect(selects))
      .select('id')
      .filter(view.toPathFromFilter(userFormula.parse(filter)))
      .filter(view.toPathFromFilter(userFormula.parse(view.toJSON().filter)))
      .orderBy(view.toOrderBy(sorts))
      .limit(pageSize)
      .offset(cursor)

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
