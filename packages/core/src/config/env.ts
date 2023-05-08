import { z } from 'zod'
import 'dotenv-flow/config'

const envSchema = z.object({
  PORT: z.coerce.number().optional(),
  SECRET: z.string(),
  DB_URL: z.string()
})
const env = process.env as unknown as z.infer<typeof envSchema>

export default env

export function checkEnv() {
  const parser = envSchema.safeParse(env)

  if (!parser.success) {
    throw new Error(`Missing environment: ${parser.error}.`)
  }
}
