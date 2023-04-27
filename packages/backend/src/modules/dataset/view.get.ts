import { viewSchema } from 'backend/models/dataset/view.schema'
import { Controller } from 'backend/server/controller'
import { rNumId } from 'backend/utils/regex'
import difference from 'lodash/difference'
import merge from 'lodash/merge'
import { z } from 'zod'

import { getViewFromDatasetById } from './utils/getViewFromDatasetById'

import type { TView } from 'backend/models/dataset/view.schema'

/**
 * When add a new column to the dataset, the view should be updated to include the new column.
 */
export const getView = new Controller(
  async (ctx, next) => {
    const {
      access: { guard },
      getDataset: { dataset }
    } = ctx.state
    const { appId, id: datasetId } = dataset
    const { viewId } = ctx.params

    guard('app:dataset:view:get', { appId, datasetId, viewId })

    const { view, viewIndex } = getViewFromDatasetById(viewId, dataset)

    // fill all the missing column in the dataset
    view.column = merge(dataset.column, view.column)
    // fill view.columns
    const differenceColumns = difference(Object.keys(view.column), view.columns)

    if (differenceColumns.length > 0) view.columns.push(...differenceColumns)

    Object.assign(ctx.state, {
      getDatasetView: {
        view,
        index: viewIndex
      }
    })

    ctx.body = {
      appId,
      datasetId,
      ...view
    }

    await next()
  },
  {
    state: ['auth', 'access', 'getDataset'],
    params: z.object({
      viewId: z.string().regex(rNumId)
    }),
    response: {
      200: viewSchema.extend({
        appId: z.string(),
        datasetId: z.string()
      })
    }
  }
)

declare module 'backend/server/controller' {
  interface State {
    getDatasetView: {
      view: TView
      index: number
    }
  }
}
