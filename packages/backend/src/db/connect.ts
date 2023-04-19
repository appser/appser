import db from 'backend/db'
import { Model } from 'backend/model'

export default async function connect() {
  await db.raw("SELECT 'test connection';")

  const env = process.env
  const forceSync = env.DB_SYNC_FORCE?.split(',') || []

  if (env.NODE_ENV !== 'production' && forceSync.length > 0) {
    await Promise.all(
      Object.values(Model.store)
        .filter(model => {
          if (forceSync.includes('*')) return true

          return forceSync.includes(model.tableName)
        })
        .map(
          async model => {
            await model.dropTable()
            await model.createTable()
          }
        )
    )
  }

  if (env.DB_RUN_SEEDS) await db.seed.run()
}
