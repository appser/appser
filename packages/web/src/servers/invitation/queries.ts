import db from 'web/vendor/db'

type GetInvitationTokenParameters = Parameters<typeof db.invite.getInvitation>[0]

export const getInviteQuery = ({ invitationToken }: GetInvitationTokenParameters) => ({
  queryKey: ['invite', 'token', invitationToken],
  queryFn: () => db.invite.getInvitation({ invitationToken })
})
