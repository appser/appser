import { Field } from 'backend/model/field'
import { z } from 'zod'

// TODO:
export default Field
  .define('relation', 'jsonb')
  .optionSchema(z.object({
    table: z.string(),
    select: z.string().array(),
    referenceKey: z.string().optional().default('id'),
    isMultiple: z.boolean().optional()
  }))
  .schema(
    opts => z.string().array().nonempty().max(opts?.isMultiple ? 500 : 1)
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

  )
  .on('response', (data, opts) => {
    const table = opts?.table

    if (!table) throw new Error('option table required')
    //    return Model.get(table).transformResponse(data)
  })
