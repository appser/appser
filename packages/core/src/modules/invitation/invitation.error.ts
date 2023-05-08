import { createErrors, t } from 'core/error'

export const invitationError = createErrors('invitation', {
  invalidToken: ['Forbidden', t('invitation.invalidToken')],
  tokenExpired: ['Forbidden', t('invitation.tokenExpired')],
  tokenNotBefore: ['Forbidden', t('invitation.tokenNotBefore')],
  alreadyJoined: ['NotFound', t('invitation.alreadyJoined')],
  invalidInviter: ['Forbidden', t('invitation.invalidInviter')]
})
