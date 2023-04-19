import { modelError } from '../model.error'

import type { types } from '../field'

interface CastAppTypeProps {
  tableName: string
  columnName: string
  from: typeof types[number]
  to: typeof types[number]
}

const MAX_SMALLINT = 32767
const MIN_SMALLINT = -32768
const smallintPattern = '[0-9]{1,4}'
const bigintPattern = '[0-9]{1,18}'
const numericPattern = '[0-9]{1,32}(.[0-9]{1,32})'

export const castMap = (column: string): CastMap => ({
  smallint: {
    smallint: ['cast(?? as smallint)', [column]],
    bigint: ['cast(?? as bigint)', [column]],
    numeric: ['cast(?? as numeric)', [column]],
    text: ['cast(?? as text)', [column]],
    boolean: ['case when ?? >= 0 then true else false end', [column]],
    timestamp: ['null'],
    jsonb: ['null'],
    'smallint[]': ['ARRAY[??]', [column]],
    'bigint[]': ['ARRAY[??]', [column]]
  },
  bigint: {
    smallint: [
      `case when ?? > ${MAX_SMALLINT} or ?? < ${MIN_SMALLINT} then null else ?? end`,
      [column, column, column]
    ],
    bigint: ['cast(?? as bigint)', [column]],
    numeric: ['cast(?? as numeric)', [column]],
    text: ['??::text', [column]],
    boolean: ['case when ?? >= 0 then true else false end', [column]],
    timestamp: ['null'],
    jsonb: ['null'],
    'smallint[]': ['null'],
    'bigint[]': ['ARRAY[??]', [column]]
  },
  numeric: {
    smallint: [
      `case when ?? > ${MAX_SMALLINT} or ?? < ${MIN_SMALLINT} then null else ?? end`,
      [column, column, column]
    ],
    bigint: ['cast(?? as bigint)', [column]],
    numeric: ['cast(?? as numeric)', [column]],
    text: ['cast(?? as text)', [column]],
    boolean: ['case when ?? >= 0 then true else false end', [column]],
    timestamp: ['null'],
    jsonb: ['null'],
    'smallint[]': ['null'],
    'bigint[]': ['null']
  },
  text: {
    smallint: [`coalesce(cast(substring(??, '(${smallintPattern})') as smallint), 0)`, [column]],
    bigint: [`coalesce(cast(substring(??, '(${bigintPattern})') as bigint), 0)`, [column]],
    numeric: [`coalesce(cast(substring(??, '(${numericPattern})') as numeric), 0)`, [column]],
    text: ['cast (?? as text)', [column]],
    boolean: ['case when ?? is null then false else true end', [column]],
    timestamp: ['null'], // Maybe can use to_timestamp(??, 'YYYY-MM-DD HH24:MI:SS'), but how to determine the format?
    jsonb: ['null'],
    'smallint[]': ['null'],
    'bigint[]': ['null']
  },
  boolean: {
    smallint: ['case when ?? then 1 else 0 end', [column]],
    bigint: ['case when ?? then 1 else 0 end', [column]],
    numeric: ['case when ?? then 1 else 0 end', [column]],
    text: ["case when ?? then 'true' else 'false' end", [column]],
    boolean: ['cast(?? as boolean)', [column]],
    timestamp: ['null'],
    jsonb: ['null'],
    'smallint[]': ['null'],
    'bigint[]': ['null']
  },
  timestamp: {
    smallint: ['null'],
    bigint: ['null'],
    numeric: ['null'],
    text: ['??::text', [column]],
    boolean: ['null'],
    timestamp: ['cast(?? as timestamp)', [column]],
    jsonb: ['null'],
    'smallint[]': ['null'],
    'bigint[]': ['null']
  },
  jsonb: {
    smallint: ['null'],
    bigint: ['null'],
    numeric: ['null'],
    text: ['??::text', [column]],
    boolean: ['null'],
    timestamp: ['null'],
    jsonb: ['cast(?? as jsonb)', [column]],
    'smallint[]': ['null'],
    'bigint[]': ['null']
  },
  'smallint[]': {
    smallint: ['cast(??[1] as smallint)', [column]],
    bigint: ['cast(??[1] as bigint)', [column]],
    numeric: ['cast(??[1] as numeric)', [column]],
    text: ['cast(?? as text)', [column]],
    boolean: ['false', [column]],
    timestamp: ['null'],
    jsonb: ['to_jsonb(??)', [column]],
    'smallint[]': ['cast(?? as smallint[])', [column]],
    'bigint[]': ['null']
  },
  'bigint[]': {
    smallint: ['null'],
    bigint: ['cast(??[1] as numeric)', [column]],
    numeric: ['cast(??[1] as numeric)', [column]],
    text: ['cast(?? as text)', [column]],
    boolean: ['false', [column]],
    timestamp: ['null'],
    jsonb: ['to_jsonb(??)', [column]],
    'smallint[]': ['null'],
    'bigint[]': ['cast(?? as bigint[])', [column]]
  }
})

type CastMap = {
  // from type
  [From in typeof types[number]]: {
    // to type
    [To in typeof types[number]]: [string, string[]?]
  }
}

export function castAppType({ tableName, columnName, from, to }: CastAppTypeProps) {
  const sql = `alter table ?? alter column ?? type ${to} using `
  const bindings: [string, string] = [tableName, columnName]
  const using = castMap(columnName)?.[from]?.[to]

  if (!using) throw modelError('castFieldFailed')

  return [`${sql}(${using[0]})`, using[1] ? bindings.concat(using[1]) : bindings] as const
}
