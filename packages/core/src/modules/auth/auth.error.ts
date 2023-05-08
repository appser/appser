import { createErrors, t } from 'backend/error'

export const authError = createErrors('auth', {
  'token.notFound': ['Unauthorized', t('auth.token.notFound')],
  'token.invalid': ['Unauthorized', t('auth.token.invalid')],
  'token.expired': ['Unauthorized', t('auth.token.expired')],
  'token.notBefore': ['Unauthorized', t('auth.token.notBefore')],
  'token.revoked': ['Unauthorized', t('auth.token.revoked')],
  'account.notMatch': ['Unauthorized', t('auth.account.notMatch')],
  'account.notFound': ['Unauthorized', t('auth.account.notFound')],
  'account.roleChanged': ['Unauthorized', t('auth.account.roleChanged')]
})
