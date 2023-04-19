import type db from 'web/vendor/db'

export type TApp = Awaited<ReturnType<typeof db.app.getApp>>
