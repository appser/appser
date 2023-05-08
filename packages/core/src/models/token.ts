/**
 * only save revoked token
 */

import { Model } from 'core/model'
import { column } from 'core/model/column'
import { z } from 'zod'

export const Token = Model.define('token', {
  id: column('bigint', z.string()).primary(),
  audience: column('bigint', z.string()),
  isRevoke: column('boolean', z.boolean()),
  expiredAt: column('timestamp', z.string().datetime())
})

export type TToken = z.infer<typeof Token.schema>

declare module 'core/model' {
  interface Models {
    token: TToken
  }
}
