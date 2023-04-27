import { z } from 'zod'

type Literal = z.infer<typeof literalSchema>
type Json = Literal | { [key: string]: Json } | Json[]

const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()])
const jsonSchema: z.ZodType<Json> = z.lazy(() => z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]))

export default jsonSchema

export type TJson = z.infer<typeof jsonSchema>
