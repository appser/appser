/**
 * only save revoked token
 */

import { Model } from 'core/db/model'
import { column } from 'core/db/model/column'
import { z } from 'zod'

export const Token = Model.define('token', {
  id: column('bigint', z.string()).primary(),
  audience: column('bigint', z.string()),
  isRevoke: column('boolean', z.boolean()),
  expiredAt: column('timestamp', z.date())
})

export type TToken = z.infer<typeof Token.schema>

declare module 'core/db/model' {
  interface Models {
    token: TToken
  }
}
