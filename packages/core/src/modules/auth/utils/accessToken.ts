import config from 'core/config'
import { authError } from 'core/modules/auth/auth.error'
import { genSnowflakeId } from 'core/vendors/snowflakeId'
import jwt, { NotBeforeError, TokenExpiredError } from 'jsonwebtoken'

export function createAccessToken({ roleId, audience }: Options) {
  const token = jwt.sign({ rol: roleId }, config.server.secret, {
    expiresIn: config.auth.accessTokenExpiresIn.join(''),
    jwtid: genSnowflakeId().toString(),
    audience
  })

  return token
}

export function parseAccessToken(token: string) {
  let payload: Payload

  try {
    payload = jwt.verify(token, config.server.secret) as Payload
  } catch (error) {
    if (error instanceof TokenExpiredError) throw authError('token.expired')
    else if (error instanceof NotBeforeError) throw authError('token.notBefore')
    else throw authError('token.invalid')
  }

  return payload
}

export interface Payload {
  iat: number
  exp: number
  aud: string
  jti: string
  rol: string
}

interface Options {
  audience: string
  roleId?: string
  issuer?: string
}
