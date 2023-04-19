import { Module } from 'backend/server/module'

import { signupWithEmail } from './email.with'
import { useAllow } from './utils/useAllow'

export default new Module(({ get, post }) => {
  post('/signup/email').use(useAllow, signupWithEmail).openapi({
    tags: 'signup',
    operationId: 'signupByEmail'
  })
})
