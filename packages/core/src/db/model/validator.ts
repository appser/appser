import { createLogger } from 'core/logger'
import flattenObject from 'core/utils/flattenObject'
import { merge, set } from 'lodash'
import { fromZodError } from 'zod-validation-error'

import { modelError } from './mode.error'

import type { Model } from '.'

const log = createLogger('model:validator')

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
      const verifiedData = this.schema
        .deepPartial()
        .strict()
        .parse(verifiableObject)

      log.debug('skip validate keys:', Object.keys(unverifiableObject))

      return merge(this.fixTopLevelArrayJSONData(verifiedData), unverifiableObject)
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
    const parser = this.schema.strict().safeParse(item)

    if (!parser.success) throw modelError('validateFail', fromZodError(parser.error))

    const ret = parser.data

    return this.fixTopLevelArrayJSONData(ret)
  }

  private transformRecord(record: Record<string, unknown>) {
    if (typeof record !== 'object' || record === null) {
      return record
    }

    this.#model.emit('response', record)

    return record
  }

  // Fix Knex bug, see:
  // https://github.com/knex/knex/issues/5320
  // https://github.com/knex/knex/issues/5430
  private fixTopLevelArrayJSONData(data: Record<string, unknown>) {
    Object.entries(this.#model.columns).forEach(([name, column]) => {
      const dataType = column.dataType

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
      if (['bigint', 'boolean', 'number', 'string', 'undefined'].includes(typeof value) || value === null || value instanceof Date) {
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
