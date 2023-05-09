import { z } from 'zod'

import db from '..'

/**
 * Parameter 3 is a bound string with two characters; '[' means inclusive, '(' exclusive
 *
 * @example
 * Array of 3 elements
 * ['2021-01-01', '2021-01-02','[]']
 * ['2021-01-01', '2021-01-02','[)']
 * ['2021-01-01', '2021-01-02','(]']
 *
 * Formula expression
 * '=ARG2ARRAY(TODAY(),"2021-01-02","[]")'
 */
const betweenSchema = z
  .tuple([
    z.string().or(z.number()),
    z.string().or(z.number()),
    z.enum(['[]', '()', '(]', '[)'])
  ])

const operatorSchema = z.object({
  eq: z.string().or(z.number()),
  neq: z.string().or(z.number()),
  gt: z.string().or(z.number()),
  gte: z.string().or(z.number()),
  lt: z.string().or(z.number()),
  lte: z.string().or(z.number()),
  in: z.string().or(z.number()).array(),
  nin: z.string().or(z.number()).array(),
  like: z.string(),
  notLike: z.string(),
  between: betweenSchema.or(z.string()),
  notBetween: betweenSchema.or(z.string()),
  null: z.boolean(),
  notNull: z.boolean()
}).partial()

export const conditionSchema = z.record(operatorSchema)

export const filterSchema = z.object({
  and: conditionSchema.array(),
  or: conditionSchema.array()
}).partial()

export type Filter = z.infer<typeof filterSchema>
export type Condition = z.infer<typeof conditionSchema>
export type ConditionBetween = z.infer<typeof betweenSchema>
export type OperatorType = keyof z.infer<typeof operatorSchema>
