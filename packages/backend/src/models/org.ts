import { Model } from 'backend/model'

import type { Optional } from '@appser/shared'
import type { Knex } from 'knex'
import type { z } from 'zod'

export const Org = Model.define('org', {
  id: {
    field: 'numId',
    options: { dynamicDefault: 'snowflakeId' },
    required: true
  },
  name: { field: 'simpleText', required: true },
  image: { field: 'url' },
  creatorId: { field: 'numId', required: true },
  createdAt: {
    field: 'date',
    options: { dynamicDefault: 'now' },
    required: true
  },
  updatedAt: {
    field: 'date',
    options: { dynamicDefault: 'now' },
    required: true
  }
})
  .primary('id')

export type TOrg = z.infer<typeof Org.schema>

declare module 'backend/model' {
  interface Models {
    org: Knex.CompositeTableType<TOrg, Optional<TOrg, 'id' | 'createdAt' | 'updatedAt'>>
  }
}
