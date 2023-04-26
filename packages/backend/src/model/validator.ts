import flattenObject from 'backend/utils/flattenObject'
import { merge, pick, set } from 'lodash'

import { modelError } from './model.error'

import type { Model } from '.'
import type { Column } from './column'

export class Validator {
  constructor(private model: Model) {
    this.model = model
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
      const picked = Object.keys(this.updateableColumns).reduce((acc, columnName) => {
        acc[columnName] = true

        return acc
      }, {} as Record<string, true>)
      const parser = this.schema
        .deepPartial()
        .pick(picked)
        .strict()
        .safeParse(verifiableObject)

      if (!parser.success) throw modelError('validateFail', parser.error.formErrors)

      const unmergedUnverifiableObject = pick(unverifiableObject, Object.keys(picked))

      return merge(this.fixTopLevelArrayJSONData(parser.data), unmergedUnverifiableObject)
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
      const field = this.model.columns[name]?.field

      if (field) {
        Object.defineProperty(record, name, {
          value: field.onResponse(value) ?? value,
          enumerable: true,
          writable: true
        })
      }
    })

    return record
  }

  // Fix Knex bug, see:
  // https://github.com/knex/knex/issues/5320
  // https://github.com/knex/knex/issues/5430
  private fixTopLevelArrayJSONData(data: Record<string, unknown>) {
    Object.entries(this.model.columns).forEach(([name, column]) => {
      if (column.field.baseType === 'jsonb' && Array.isArray(data[name])) {
        data[name] = JSON.stringify(data[name])
      }
    })

    return data
  }

  private get schema() {
    return this.model.schema
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

  private get updateableColumns() {
    return Object
      .keys(this.model.columns)
      .reduce((acc, columnName) => {
        if (!this.model.columns[columnName].isLocked) {
          acc[columnName] = this.model.columns[columnName]
        }

        return acc
      }, {} as Record<string, Column>)
  }
}
