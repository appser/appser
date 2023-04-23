import { modelError } from '../model.error'

import type { types } from '../field'

interface CastTypeProps {
  tableName: string
  columnName: string
  from: typeof types[number]
  to: typeof types[number]
}

const MAX_SMALLINT = 32767
const MIN_SMALLINT = -32768
const smallintPattern = '[0-9]{1,4}'
const bigintPattern = '[0-9]{1,18}'

export const castMap = (column: string): CastMap => ({
  smallint: {
    smallint: ['cast(?? as smallint)', [column]],
    bigint: ['cast(?? as bigint)', [column]],
    text: ['cast(?? as text)', [column]],
    boolean: ['case when ?? >= 0 then true else false end', [column]],
    timestamp: ['null'],
    jsonb: ['null']
  },
  bigint: {
    smallint: [
      `case when ?? > ${MAX_SMALLINT} or ?? < ${MIN_SMALLINT} then null else ?? end`,
      [column, column, column]
    ],
    bigint: ['cast(?? as bigint)', [column]],
    text: ['??::text', [column]],
    boolean: ['case when ?? >= 0 then true else false end', [column]],
    timestamp: ['null'],
    jsonb: ['null']
  },
  text: {
    smallint: [`coalesce(cast(substring(??, '(${smallintPattern})') as smallint), 0)`, [column]],
    bigint: [`coalesce(cast(substring(??, '(${bigintPattern})') as bigint), 0)`, [column]],
    text: ['cast (?? as text)', [column]],
    boolean: ['case when ?? is null then false else true end', [column]],
    timestamp: ['null'], // Maybe can use to_timestamp(??, 'YYYY-MM-DD HH24:MI:SS'), but how to determine the format?
    jsonb: ['null']
  },
  boolean: {
    smallint: ['case when ?? then 1 else 0 end', [column]],
    bigint: ['case when ?? then 1 else 0 end', [column]],
    text: ["case when ?? then 'true' else 'false' end", [column]],
    boolean: ['cast(?? as boolean)', [column]],
    timestamp: ['null'],
    jsonb: ['null']
  },
  timestamp: {
    smallint: ['null'],
    bigint: ['null'],
    text: ['??::text', [column]],
    boolean: ['null'],
    timestamp: ['cast(?? as timestamp)', [column]],
    jsonb: ['null']
  },
  jsonb: {
    smallint: ['null'],
    bigint: ['null'],
    text: ['??::text', [column]],
    boolean: ['null'],
    timestamp: ['null'],
    jsonb: ['cast(?? as jsonb)', [column]]
  }
})

type CastMap = {
  // from type
  [From in typeof types[number]]: {
    // to type
    [To in typeof types[number]]: [string, string[]?]
  }
}

export function castType({ tableName, columnName, from, to }: CastTypeProps) {
  const sql = `alter table ?? alter column ?? type ${to} using `
  const bindings: [string, string] = [tableName, columnName]
  const using = castMap(columnName)?.[from]?.[to]

  if (!using) throw modelError('castFieldFailed')

  return [`${sql}(${using[0]})`, using[1] ? bindings.concat(using[1]) : bindings] as const
}
