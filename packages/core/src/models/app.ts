import { Model } from 'core/db/model'
import { column } from 'core/db/model/column'
import { genSnowflakeId } from 'core/vendors/snowflakeId'
import { z } from 'zod'

import type { Optional } from '@appser/common'
import type { Knex } from 'knex'

export const App = Model.define('app', {
  id: column('bigint', z.string().default(() => genSnowflakeId().toString())).primary(),
  orgId: column('bigint', z.string()),
  name: column('text', z.string().optional()),
  tintColor: column('text', z.string()),
  icon: column('text', z.string()),
  createdAt: column('timestamp', z.date().default(() => new Date())),
  updatedAt: column('timestamp', z.date().default(() => new Date()))
})

export type TApp = z.infer<typeof App.schema>

declare module 'core/db/model' {
  interface Models {
    app: Knex.CompositeTableType<TApp, Optional<TApp, 'id' | 'createdAt' | 'updatedAt'>>
  }
}
