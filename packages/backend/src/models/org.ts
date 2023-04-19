import { Model } from 'backend/model'

import type { Optional } from '@appser/shared'
import type { Knex } from 'knex'
import type { z } from 'zod'

export const Org = Model.define('org', {
  id: {
    field: 'numId',
    options: { dynamicDefault: 'snowflakeId' },
    isRequired: true
  },
  name: { field: 'simpleText', isRequired: true },
  image: { field: 'url' },
  creatorId: { field: 'numId', isRequired: true },
  createdAt: {
    field: 'date',
    options: { dynamicDefault: 'now' },
    isRequired: true
  },
  updatedAt: {
    field: 'date',
    options: { dynamicDefault: 'now' },
    isRequired: true
  }
})
  .primary('id')

export type TOrg = z.infer<typeof Org.schema>

declare module 'backend/db' {
  interface Dataset {
    org: Knex.CompositeTableType<TOrg, Optional<TOrg, 'id' | 'createdAt' | 'updatedAt'>>
  }
}
