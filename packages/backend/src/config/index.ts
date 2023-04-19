import { z } from 'zod'

import env from './env'

export const configSchema = z.object({
  db: z.object({
    url: z.string()
  }),
  server: z.object({
    port: z.coerce.number(),
    secret: z.string()
  }),
  auth: z.object({
    accessTokenExpiresIn: z.tuple([z.number(), z.enum(['d', 'm', 's'])])
  }),
  signup: z.object({
    allow: z.enum(['always', 'never', 'onlyByInvite'])
  }),
  invitation: z.object({
    invitationTokenExpiresIn: z.tuple([z.number(), z.string()])
  }),
  vendors: z.object({
    bcrypt: z.object({
      seedLength: z.number()
    }),
    snowflakeId: z.object({
      customEpoch: z.number(),
      instanceId: z.number()
    })
  })
})

export const defaultConfig: z.infer<typeof configSchema> = {
  db: {
    url: env.DB_URL
  },
  server: {
    port: Number(env.PORT) ?? 3000,
    secret: env.SECRET
  },
  auth: {
    accessTokenExpiresIn: [10, 'd']
  },
  signup: {
    allow: 'onlyByInvite'
  },
  invitation: {
    invitationTokenExpiresIn: [1, 'd']
  },
  vendors: {
    bcrypt: {
      seedLength: 10
    },
    snowflakeId: {
      customEpoch: +new Date('2022-06-21T12:18:21.321Z'),
      instanceId: 1
    }
  }
}

export default defaultConfig
