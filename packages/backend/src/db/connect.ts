import db from 'backend/db'
import { Model } from 'backend/model'

export default async function connect() {
  await db.raw("SELECT 'test connection';")
  await Model.createTables()

  const env = process.env

  if (env.DB_RUN_SEEDS) await db.seed.run()
}
