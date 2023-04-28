/**
 * only save revoked token
 */

import { Model } from 'backend/model'

import type { z } from 'zod'

export const Token = Model.define('token', {
  id: { field: 'numId', required: true },
  audience: { field: 'numId', required: true },
  isRevoke: { field: 'checkbox', required: true },
  expiredAt: { field: 'date', required: true }
})
  .primary('id')

export type TToken = z.infer<typeof Token.schema>

declare module 'backend/model' {
  interface Models {
    token: TToken
  }
}
