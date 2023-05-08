import { extname, join } from 'node:path'

import config from 'backend/config'

import type { Knex } from 'knex'

const loadExtensions = [extname(__filename)]

export default {
  client: 'pg',
  connection: config.db.url,
  pool: {
    min: 0,
    max: 7
  },
  migrations: {
    tableName: 'migrations',
    directory: join(__dirname, './migrations'),
    loadExtensions
  },
  seeds: {
    directory: join(__dirname, './seeds'),
    loadExtensions
  }

} as Knex.Config
