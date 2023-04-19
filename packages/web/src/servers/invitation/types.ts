import type db from 'web/vendor/db'

export type TInvitation = Awaited<ReturnType<typeof db.invite.getInvitation>>
