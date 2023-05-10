import { viewSchema } from 'core/modules/dataset/helpers/view/view.schema'
import { Controller } from 'core/server/controller'
import { rNumId } from 'core/utils/regex'
import { z } from 'zod'

import { View } from './helpers/view/view'

export const getView = new Controller(
  async (ctx, next) => {
    const {
      access: { guard },
      getDataset: { dataset }
    } = ctx.state
    const { appId, id: datasetId } = dataset
    const { viewId } = ctx.params

    guard('app:dataset:view:get', { appId, datasetId, viewId })

    const { view, viewIndex } = View.getById(dataset, viewId)

    // fill all the missing field
    Object.keys(dataset.field).forEach((name) => {
      if (!view.field[name]) {
        view.field[name] = {
          selected: false
        }
      }

      view.fields.includes(name) || view.fields.push(name)
    })

    Object.assign(ctx.state, {
      getDatasetView: {
        view: new View(view, dataset),
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

declare module 'core/server/controller' {
  interface State {
    getDatasetView: {
      view: View
      index: number
    }
  }
}
