import type db from 'web/vendor/db'

export type TOrg = Awaited<ReturnType<typeof db.org.getOrg>>

export type TRole = Awaited<ReturnType<typeof db.org.listOrgRole>>[number]
