import { roles } from '@appser/access'
import { values } from 'lodash'

import type { Knex } from 'knex'

export async function seed(db: Knex) {
  // await db('role').del()
  const defaultRoles = values(roles).map((role) => values(role)).flat()
  await db('role').model().insert(defaultRoles)
}
