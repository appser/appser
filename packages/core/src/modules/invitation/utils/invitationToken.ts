import config from 'core/config'
import jwt, { NotBeforeError, TokenExpiredError } from 'jsonwebtoken'

import { invitationError } from '../invitation.error'

export interface Payload {
  iat: number
  exp: number
  iss: string
  /** role id */
  rol: string
  /** org id */
  wid?: string
}

interface Options {
  issuer: string
  roleId: string
  orgId?: string
}

export function createInvitationToken({ orgId, roleId, issuer }: Options) {
  const token = jwt.sign({ wid: orgId, rol: roleId }, config.server.secret, {
    expiresIn: config.invitation.invitationTokenExpiresIn.join(''),
    issuer
  })

  return token
}

export function parseInvitationToken(token: string) {
  let payload: Payload

  try {
    payload = jwt.verify(token, config.server.secret) as Payload
  }
  catch (error) {
    if (error instanceof TokenExpiredError) throw invitationError('tokenExpired')
    else if (error instanceof NotBeforeError) throw invitationError('tokenNotBefore')
    else throw invitationError('invalidToken', error)
  }

  if (!payload.wid) throw invitationError('invalidToken')

  return payload
}
