import { z } from 'zod'

import { CustomColumn } from '../column'
import { fields } from '../fields'

const {
  checkbox,
  date,
  email,
  multipleSelect,
  number,
  numId,
  richText,
  simpleText,
  singleSelect,
  url,
  account
} = fields

const columnBaseConfigSchema = z.object({
  title: z.string().max(255).trim(),
  required: z.boolean(),
  /**
   * When set to true, the column can only be updated its title
   */
  locked: z.boolean(),
  deletedAt: z.string()
}).strict().partial()

export const publicColumnConfigSchema = z.discriminatedUnion('field', [
  z.object({ field: z.literal('checkbox'), options: checkbox.optionSchema }),
  z.object({ field: z.literal('date'), options: date.optionSchema }),
  z.object({ field: z.literal('email'), options: email.optionSchema }),
  z.object({ field: z.literal('multipleSelect'), options: multipleSelect.optionSchema }),
  z.object({ field: z.literal('number'), options: number.optionSchema }),
  z.object({ field: z.literal('numId'), options: numId.optionSchema }),
  z.object({ field: z.literal('simpleText'), options: simpleText.optionSchema }),
  z.object({ field: z.literal('singleSelect'), options: singleSelect.optionSchema }),
  z.object({ field: z.literal('url'), options: url.optionSchema })
]).and(columnBaseConfigSchema)

export const privateColumnConfigSchema = z.discriminatedUnion('field', [
  z.object({ field: z.literal('richText'), options: richText.optionSchema }),
  z.object({ field: z.literal('account'), options: account.optionSchema })
]).and(columnBaseConfigSchema)

export const columnConfigSchema = publicColumnConfigSchema.or(privateColumnConfigSchema)

const columnsSchema = z.record(columnConfigSchema.or(z.instanceof(CustomColumn)))
export type Columns = z.infer<typeof columnsSchema>
