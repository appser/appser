import { Controller } from 'core/server/controller'
import { z } from 'zod'

import { viewSchema } from './helpers/view/view.schema'

// TODO: pageToken
export const queryViewRecord = new Controller(
  async (ctx, next) => {
    const {
      access: { guard },
      getDataset: { dataset, record: { model } },
      getDatasetView: { view },
      formula: { userFormula }
    } = ctx.state
    const { appId, id: datasetId } = dataset
    const { id: viewId } = view.toJSON()
    const { pageToken: cursor = 0, filter, sorts, fields, pageSize = 50 } = ctx.request.body

    guard('app:dataset:view:record:query', { appId, datasetId, viewId })

    view.updateConfig({ filter, sorts, fields })

    const records = await model.query
      .where('datasetId', datasetId)
      .select(view.toSelectQuery())
      .select('datasetId', 'id')
      .filter(view.toFilterQuery(userFormula.parse(filter)))
      .filter(view.toFilterQuery(userFormula.parse(view.toJSON().filter)))
      .orderBy(view.toOrderByQuery(sorts))
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
    body: viewSchema.pick({
      filter: true,
      sorts: true,
      fields: true
    }).extend({
      pageSize: z.number().int().max(100).default(50),
      pageToken: z.number().int().optional()
    }).partial(),
    response: {
      200: z.object({
        records: z.object({
          datasetId: z.string(),
          id: z.string()
        }).catchall(z.any()).array(),
        pageToken: z.number().int().optional()
      })
    }
  }
)
