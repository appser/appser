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
  isRequired: z.boolean(),
  /**
   * When set to true, the column can only be updated its title.
   */
  isLocked: z.boolean(),
  deletedAt: z.coerce.date()
}).partial()

export const publicColumnConfigSchema = z.discriminatedUnion('field', [
  z.object({ field: z.literal('checkbox'), options: z.unknown() }),
  z.object({ field: z.literal('date'), options: date.config.optionSchema! }),
  z.object({ field: z.literal('email'), options: z.unknown() }),
  z.object({ field: z.literal('multipleSelect'), options: multipleSelect.config.optionSchema! }),
  z.object({ field: z.literal('number'), options: number.config.optionSchema! }),
  z.object({ field: z.literal('numId'), options: numId.config.optionSchema! }),
  z.object({ field: z.literal('simpleText'), options: z.unknown() }),
  z.object({ field: z.literal('singleSelect'), options: singleSelect.config.optionSchema! }),
  z.object({ field: z.literal('url'), options: z.unknown() })
]).and(columnBaseConfigSchema)

export const privateColumnConfigSchema = z.discriminatedUnion('field', [
  z.object({ field: z.literal('richText'), options: z.unknown() }),
  z.object({ field: z.literal('account'), options: account.config.optionSchema! })
]).and(columnBaseConfigSchema)

export const columnConfigSchema = publicColumnConfigSchema.or(privateColumnConfigSchema)
const columnsSchema = z.record(columnConfigSchema.or(z.instanceof(CustomColumn)))

export type Columns = z.infer<typeof columnsSchema>
