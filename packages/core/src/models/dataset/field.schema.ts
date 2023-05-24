import { z } from 'zod'

import { fields } from './fields'

const {
  checkbox,
  date,
  email,
  numId,
  multipleSelect,
  number,
  simpleText,
  singleSelect,
  url
} = fields

const baseSchema = z.object({
  name: z.string(),
  title: z.string().max(255).trim(),
  required: z.boolean(),
  locked: z.boolean(),
  deletedAt: z.string()
}).partial()

export const fieldOptionSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('numId'), options: numId.optionSchema }),
  z.object({ type: z.literal('checkbox'), options: checkbox.optionSchema }),
  z.object({ type: z.literal('date'), options: date.optionSchema }),
  z.object({ type: z.literal('email'), options: email.optionSchema }),
  z.object({ type: z.literal('multipleSelect'), options: multipleSelect.optionSchema }),
  z.object({ type: z.literal('number'), options: number.optionSchema }),
  z.object({ type: z.literal('simpleText'), options: simpleText.optionSchema }),
  z.object({ type: z.literal('singleSelect'), options: singleSelect.optionSchema }),
  z.object({ type: z.literal('url'), options: url.optionSchema })
])

export const datasetFieldSchema = fieldOptionSchema.and(baseSchema)

export type DatasetFieldConfig = z.infer<typeof datasetFieldSchema>
