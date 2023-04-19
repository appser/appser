import { unsafeViewSchema } from 'backend/models/dataset'
import { Controller } from 'backend/server/controller'
import { serverError } from 'backend/server/server.error'
import { PositionObject } from 'backend/utils/positionObject'
import { rNumId } from 'backend/utils/regex'
import { z } from 'zod'

import { datasetError } from './dataset.error'

import type { TView } from 'backend/models/dataset'

export const getView = new Controller(
  async (ctx, next) => {
    const {
      access: { can },
      getDataset: { dataset }
    } = ctx.state
    const { appId, id: datasetId } = dataset
    const { viewId } = ctx.params
    const { deny } = can('app:dataset:view:get', { appId, datasetId, viewId })

    if (deny) return ctx.throw(serverError('accessForbidden'))

    const viewIndex = dataset.views.findIndex(view => view.id === viewId)
    const view = dataset.views[viewIndex]

    if (!view) return ctx.throw(datasetError('viewNotFound'))

    // fill all the missing columns
    const column = new PositionObject(view.column)

    Object.keys(dataset.column).forEach((columnName) => {
      if (!view.column[columnName]) {
        column.add(columnName, {
          selected: false
        })
      }
    })

    view.column = column.toObject()

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
      200: unsafeViewSchema.extend({
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
