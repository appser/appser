import db from 'backend/db'
import { filterSchema } from 'backend/db/filter'
import { Controller } from 'backend/server/controller'
import { serverError } from 'backend/server/server.error'
import { z } from 'zod'

// TODO: pageToken
export const queryRecord = new Controller(
  async (ctx, next) => {
    const {
      access: { can },
      getDataset: { dataset, model },
      getDatasetView: { view },
      formula
    } = ctx.state
    const { appId, id: datasetId } = dataset
    const { id: viewId } = view
    const { pageToken: cursor = 0, filter, sorts, selects = [], pageSize } = ctx.request.body
    const { deny } = can('app:dataset:view:record:query', { appId, datasetId, viewId })

    if (deny) return ctx.throw(serverError('accessForbidden'))

    const select = view.selects
      .filter(s => !s.startsWith('-'))
      .filter(s => selects.includes(s))
    const records = await db(dataset.id)
      .model(model)
      .limit(pageSize)
      .offset(cursor)
      .select([...new Set(['id', ...select])]) // always select `id` column
      .filter(formula.parse(filter))
      .filter(formula.parse(view.filter))
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
      sorts: z.string().or(z.string().array()).transform(v => [v].flat()).optional(),
      selects: z.string().or(z.string().array()).transform(v => [v].flat()).optional(),
      pageSize: z.number().int().max(100).default(50),
      pageToken: z.number().int().optional()
    }),
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
