import { viewSchema } from 'backend/models/dataset/view.schema'
import { Controller } from 'backend/server/controller'
import { rNumId } from 'backend/utils/regex'
import { z } from 'zod'

import { getViewFromDatasetById } from './utils/getViewFromDatasetById'

import type { TView } from 'backend/models/dataset/view.schema'

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

    // fill all the missing column
    Object.entries(dataset.column).forEach(([name, config]) => {
      view.column[name] = {
        selected: false,
        ...config
      }
      view.columns.includes(name) || view.columns.push(name)
    })

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
