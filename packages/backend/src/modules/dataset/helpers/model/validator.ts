import flattenObject from 'backend/utils/flattenObject'
import { merge, set } from 'lodash'

import { FieldColumn } from './column'
import { modelError } from './model.error'

import type { Model } from '.'

export class Validator {
  #model

  constructor(model: Model) {
    this.#model = model
  }

  parseInsert(data: unknown) {
    if (Array.isArray(data)) {
      return data.map(record => this.parseInsertItem(record))
    } else if (typeof data === 'object' && data !== null) {
      return this.parseInsertItem(data as Record<string, unknown>)
    } else {
      throw modelError('invalidInsertType')
    }
  }

  parseUpdate(data: unknown) {
    if (typeof data === 'object' && data !== null) {
      const { verifiableObject, unverifiableObject } = this.filterQueryData(data)
      const parser = this.schema
        .deepPartial()
        .strict()
        .safeParse(verifiableObject)

      if (!parser.success) throw modelError('validateFail', parser.error.formErrors)

      return merge(this.fixTopLevelArrayJSONData(parser.data), unverifiableObject)
    } else {
      throw modelError('invalidUpdateType')
    }
  }

  transformResponse(data: unknown) {
    if (Array.isArray(data)) {
      return data.map(record => this.transformRecord(record))
    }
    else if (typeof data === 'object' && data !== null) {
      return this.transformRecord(data as Record<string, unknown>)
    }
    else {
      return data
    }
  }

  private get schema() {
    return this.#model.schema
  }

  private parseInsertItem(item: Record<string, unknown>) {
    // parser can remove additional properties and set default value
    const parser = this.schema.safeParse(item)

    if (!parser.success) throw modelError('validateFail', parser.error.formErrors)

    const ret = parser.data

    return this.fixTopLevelArrayJSONData(ret)
  }

  private transformRecord(record: Record<string, unknown>) {
    if (typeof record !== 'object' || record === null) {
      return record
    }

    Object.entries(record).forEach(([name, value]) => {
      const column = this.#model.columns[name]
      const field = (column instanceof FieldColumn) && column.field

      // TODO: fix using alias select like `select('id as user_id')`
      field && field.emit('response', value as any, field.options)
    })

    return record
  }

  // Fix Knex bug, see:
  // https://github.com/knex/knex/issues/5320
  // https://github.com/knex/knex/issues/5430
  private fixTopLevelArrayJSONData(data: Record<string, unknown>) {
    Object.entries(this.#model.columns).forEach(([name, column]) => {
      const dataType = column instanceof FieldColumn ? column.field.dataType : column.dataType

      if (dataType === 'jsonb' && Array.isArray(data[name])) {
        data[name] = JSON.stringify(data[name])
      }
    })

    return data
  }

  /**
   * The values of data might be rendered as a function or certain special object instances.
   * If you activate the Knex model plugin and modify data using query statements, the schema will not be used to validate the data.
   * e.g. `knex('table').update({ name: knex.raw('id + 1') })`, the name column will not be validated.
   */
  private filterQueryData(data: {}) {
    const flattenData = flattenObject(data)

    return Object.entries(flattenData).reduce((acc, [key, value]) => {
      if (['bigint', 'boolean', 'number', 'string', 'undefined'].includes(typeof value) || value === null) {
        acc.verifiableObject = set(acc.verifiableObject, key, value)
      } else {
        acc.unverifiableObject = set(acc.unverifiableObject, key, value)
      }

      return acc
    }, {
      verifiableObject: {} as Record<string, unknown>,
      unverifiableObject: {} as Record<string, unknown>
    })
  }
}
