import { useMutation } from '@tanstack/react-query'
import db from 'web/vendor/db'

type CreateOrgInvitationParams = Parameters<typeof db.org.createOrgInvitation>[0]

export const useCreateOrgInvitation = () => {
  return useMutation({
    mutationFn: (p: CreateOrgInvitationParams) => db.org.createOrgInvitation(p)
  })
}
