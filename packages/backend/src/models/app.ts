import { Model } from 'backend/model'

import type { Optional } from '@appser/shared'
import type { Knex } from 'knex'
import type { z } from 'zod'

export const App = Model.define('app', {
  id: { field: 'numId', options: { dynamicDefault: 'snowflakeId' }, required: true },
  orgId: { field: 'numId', required: true },
  name: { field: 'simpleText' },
  tintColor: { field: 'simpleText', required: true },
  icon: { field: 'simpleText', required: true },
  createdAt: { field: 'date', options: { dynamicDefault: 'now' }, required: true },
  updatedAt: { field: 'date', options: { dynamicDefault: 'now' }, required: true }
})
  .primary('id')

export type TApp = z.infer<typeof App.schema>

declare module 'backend/model' {
  interface Models {
    app: Knex.CompositeTableType<TApp, Optional<TApp, 'id' | 'createdAt' | 'updatedAt'>>
  }
}
