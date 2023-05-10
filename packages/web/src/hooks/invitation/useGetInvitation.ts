import db from 'web/vendor/db'

export const getInvitationQuery = (invitationToken: string) => ({
  queryKey: ['invite', 'token', invitationToken],
  queryFn: () => db.invite.getInvitation({ invitationToken })
})
