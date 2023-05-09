import { createErrors, t } from 'core/error'

export const signupError = createErrors('signup', {
  userExist: ['Forbidden', t('signup.userExist')],
  denySignup: ['Forbidden', t('signup.denySignup')]
})
