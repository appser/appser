import { createErrors, t } from 'backend/error'

export const signupError = createErrors('signup', {
  userExist: ['Forbidden', t('signup.userExist')],
  denySignup: ['Forbidden', t('signup.denySignup')]
})
