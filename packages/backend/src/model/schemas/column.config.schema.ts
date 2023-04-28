import { z } from 'zod'

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

const baseConfigSchema = z.object({
  required: z.boolean()
}).partial()

export const publicFieldColumnConfigSchema = z.discriminatedUnion('field', [
  z.object({ field: z.literal('checkbox'), options: checkbox.optionSchema }),
  z.object({ field: z.literal('date'), options: date.optionSchema }),
  z.object({ field: z.literal('email'), options: email.optionSchema }),
  z.object({ field: z.literal('multipleSelect'), options: multipleSelect.optionSchema }),
  z.object({ field: z.literal('number'), options: number.optionSchema }),
  z.object({ field: z.literal('numId'), options: numId.optionSchema }),
  z.object({ field: z.literal('simpleText'), options: simpleText.optionSchema }),
  z.object({ field: z.literal('singleSelect'), options: singleSelect.optionSchema }),
  z.object({ field: z.literal('url'), options: url.optionSchema })
]).and(baseConfigSchema)

export const privateFieldColumnConfigSchema = z.discriminatedUnion('field', [
  z.object({ field: z.literal('richText'), options: richText.optionSchema }),
  z.object({ field: z.literal('account'), options: account.optionSchema })
]).and(baseConfigSchema)

export const fieldColumnConfigSchema = publicFieldColumnConfigSchema.or(privateFieldColumnConfigSchema)

export type TFieldColumnConfig = z.infer<typeof fieldColumnConfigSchema>
