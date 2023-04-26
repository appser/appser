import { z } from 'zod'

import type { Policy } from '@appser/access'
import type { Schema } from 'zod'

export const policySchema: Schema<Policy> = z.object({
  action: z.union([z.string(), z.string().array()]),
  resource: z.object({}).catchall(z.string().or(z.string().array())),
  attributes: z.string().array().optional(),
  effect: z.enum(['allow', 'deny']).optional(),
  role: z.coerce.string().optional()
})
