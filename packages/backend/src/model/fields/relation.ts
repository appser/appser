import { Model } from 'backend/model'
import Field from 'backend/model/field'
import { z } from 'zod'

// TODO :fix circular dependency (field.ts -> model.ts -> field.ts)
export default Field.define(
  'relation',
  {
    baseType: 'jsonb',
    optionSchema: z.object({
      table: z.string(),
      select: z.string().array(),
      referenceKey: z.string().optional().default('id'),
      isMultiple: z.boolean().optional()
    })
  },
  opts => z.string().array().nonempty().max(opts?.isMultiple ? 500 : 1),
  {
    /*
    onQuery({ queryBuilder, column, model }, { select, table, referenceKey, isMultiple }) {
      if (!queryBuilder || !isSelect(queryBuilder, column.name)) return

      const db = queryBuilder.client

      queryBuilder.select(
        db.raw('(select json_agg(t) from (select ?? from ?? where ?? = any(??) limit ?) t) as ??', [
          select,
          table,
          referenceKey,
          `${model.tableName}.${column.name}`,
          isMultiple ? 500 : 1,
          column.name
        ])
      )
    },
    */
    onResponse(data, options) {
      const table = options?.table

      if (!table) throw new Error('option table required')

      return Model.get(table).transformResponse(data)
    }
  }
)
