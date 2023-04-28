import { Controller } from 'backend/server/controller'
import { z } from 'zod'

import type { FieldColumn } from 'backend/model/column'
import type { TDatasetColumnConfig } from 'backend/models/dataset/dataset.record.schema'

export const getColumn = new Controller(
  async (ctx, next) => {
    const {
      access: { guard },
      getDataset: { record, dataset }
    } = ctx.state
    const { appId, id: datasetId } = dataset
    const { columnName } = ctx.params

    guard('app:dataset:column:get', { appId, datasetId, columnName })

    const column = record.model.getColumn(columnName) as FieldColumn<TDatasetColumnConfig>

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
      column: FieldColumn<TDatasetColumnConfig>
    }
  }
}
