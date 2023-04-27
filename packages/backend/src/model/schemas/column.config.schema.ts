import { z } from 'zod'

import { fields } from '../fields'

const columnBaseConfigSchema = z.object({
  title: z.string().max(255).trim(),
  isRequired: z.boolean(),
  /**
   * When set to true, the column can only be updated its title.
   */
  isLocked: z.boolean(),
  deletedAt: z.coerce.date()
}).partial()

export const publicColumnConfigSchema = z.discriminatedUnion('field', [
  z.object({ field: z.literal('checkbox'), options: z.unknown().optional() }),
  z.object({ field: z.literal('date'), options: fields.date.optionSchema }),
  z.object({ field: z.literal('email'), options: z.unknown().optional() }),
  z.object({ field: z.literal('multipleSelect'), options: fields.multipleSelect.optionSchema }),
  z.object({ field: z.literal('number'), options: fields.number.optionSchema }),
  z.object({ field: z.literal('numId'), options: fields.numId.optionSchema }),
  z.object({ field: z.literal('simpleText'), options: fields.simpleText.optionSchema }),
  z.object({ field: z.literal('singleSelect'), options: fields.singleSelect.optionSchema }),
  z.object({ field: z.literal('url'), options: z.unknown().optional() })
]).and(columnBaseConfigSchema)

export const privateColumnConfigSchema = z.discriminatedUnion('field', [
  z.object({ field: z.literal('richText'), options: z.unknown().optional() }),
  z.object({ field: z.literal('account'), options: fields.account.optionSchema }),
  z.object({ field: z.literal('custom'), schema: z.instanceof(z.ZodType), options: z.unknown().optional() })
]).and(columnBaseConfigSchema)

export const columnConfigSchema = publicColumnConfigSchema.or(privateColumnConfigSchema)
const columnsSchema = z.record(columnConfigSchema)

export type Columns = z.infer<typeof columnsSchema>
