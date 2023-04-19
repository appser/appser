/**
 * only save revoked token
 */

import { Model } from 'backend/model'

import type { z } from 'zod'

export const Token = Model.define('token', {
  id: { field: 'numId', isRequired: true },
  audience: { field: 'numId', isRequired: true },
  isRevoke: { field: 'checkbox', isRequired: true },
  expiredAt: { field: 'date', isRequired: true }
})
  .primary('id')

export type TToken = z.infer<typeof Token.schema>

declare module 'backend/db' {
  interface Dataset {
    token: TToken
  }
}
