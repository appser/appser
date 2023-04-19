import { Controller } from 'backend/server/controller'
import { serverError } from 'backend/server/server.error'
import { z } from 'zod'

import type { Column } from 'backend/model/column'

export const getColumn = new Controller(
  async (ctx, next) => {
    const {
      access: { can },
      getDataset: { model, dataset }
    } = ctx.state
    const { appId, id: datasetId } = dataset
    const { columnName } = ctx.params
    const { deny } = can('app:dataset:column:get', { appId, datasetId, columnName })

    if (deny) return ctx.throw(serverError('accessForbidden'))

    const column = model.getColumn(columnName)

    Object.assign(ctx.state, {
      getDatasetColumn: {
        column
      }
    })

    await next()
  },
  {
    state: ['auth', 'access', 'getDataset'],
    params: z.object({
      columnName: z.string()
    })
  }
)

declare module 'backend/server/controller' {
  interface State {
    getDatasetColumn: {
      column: Column
    }
  }
}
