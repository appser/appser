import { Controller } from 'backend/server/controller'
import { z } from 'zod'

import type { Column } from 'backend/model/column'

export const getColumn = new Controller(
  async (ctx, next) => {
    const {
      access: { guard },
      getDataset: { model, dataset }
    } = ctx.state
    const { appId, id: datasetId } = dataset
    const { columnName } = ctx.params

    guard('app:dataset:column:get', { appId, datasetId, columnName })

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
