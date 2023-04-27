import { z } from 'zod'

import account from './fields/account'
// import attachment from './fields/attachment'
import checkbox from './fields/checkbox'
import custom from './fields/custom'
import date from './fields/date'
import email from './fields/email'
import multipleSelect from './fields/multipleSelect'
import number from './fields/number'
import numId from './fields/numId'
// import relation from './fields/relation'
import richText from './fields/richText'
import simpleText from './fields/simpleText'
import singleSelect from './fields/singleSelect'
import url from './fields/url'

const publicField = { checkbox, date, email, multipleSelect, number, numId, richText, simpleText, singleSelect, url }
const privateField = { account, custom }

export const field = { ...publicField, ...privateField } as const

type FieldsTuple = [keyof typeof field, ...(keyof typeof field)[]]

export const publicFields = Object.keys(publicField) as FieldsTuple
export const fields = Object.keys(field) as FieldsTuple

const columnOptionSchema = z.object({
  title: z.string().max(255).trim(),
  isRequired: z.boolean(),
  /**
   * When set to true, the column can only be updated its title.
   */
  isLocked: z.boolean()
}).partial()

export const publicColumnConfigSchema = z.discriminatedUnion('field', [
  z.object({ field: z.literal('checkbox'), options: z.unknown().optional() }),
  z.object({ field: z.literal('date'), options: date.optionSchema }),
  z.object({ field: z.literal('email'), options: z.unknown().optional() }),
  z.object({ field: z.literal('multipleSelect'), options: multipleSelect.optionSchema }),
  z.object({ field: z.literal('number'), options: number.optionSchema }),
  z.object({ field: z.literal('numId'), options: numId.optionSchema }),
  z.object({ field: z.literal('simpleText'), options: simpleText.optionSchema }),
  z.object({ field: z.literal('singleSelect'), options: singleSelect.optionSchema }),
  z.object({ field: z.literal('url'), options: z.unknown().optional() })
]).and(columnOptionSchema)

export const privateColumnConfigSchema = z.discriminatedUnion('field', [
  z.object({ field: z.literal('richText'), options: z.unknown().optional() }),
  z.object({ field: z.literal('account'), options: account.optionSchema }),
  z.object({ field: z.literal('custom'), schema: z.instanceof(z.ZodType), options: z.unknown().optional() })
]).and(columnOptionSchema)

export const columnConfigSchema = publicColumnConfigSchema.or(privateColumnConfigSchema)

const columnsSchema = z.record(columnConfigSchema)

export type Columns = z.infer<typeof columnsSchema>
