import db from 'core/db'
import { pathToColumn } from 'core/db/helpers/pathToColumn'
import { merge } from 'lodash'

import { datasetError } from '../../dataset.error'

import type { Condition } from 'core/db/filter/filter.schema'
import type { TDataset } from 'core/models/dataset'
import type { TView } from 'core/modules/dataset/helpers/view/view.schema'

const columnTypeFields = ['id', 'creator', 'lastEditor', 'createdAt', 'updatedAt']
const PARENT_COLUMN = 'data'

export class View {
  #dataset
  #config

  constructor(config: TView, fromDataset?: Pick<TDataset, 'field'>) {
    this.#config = config
    this.#dataset = fromDataset
  }

  static getById(fromDataset: TDataset, viewId: string) {
    const viewIndex = fromDataset.views.findIndex(view => view.id === viewId)
    const view = fromDataset.views[viewIndex]

    if (!view) throw datasetError('viewNotFound')

    return { view, viewIndex }
  }

  get dataset() {
    if (!this.#dataset) throw new Error('Dataset of view not found')

    return this.#dataset
  }

  get selectedFields() {
    return this.#config.fields.filter(f => this.#config.field[f].selected)
  }

  updateConfig(config: Partial<TView>) {
    this.validateConfig(config)
    this.#config = merge(this.#config, config)

    return this
  }

  validateConfig(config: Partial<TView>) {
    const { field, fields, filter, sorts, stickyField } = config
    const datasetAvailableFieldNames = Object.keys(this.dataset.field)
    const viewAvailableFieldNames = Object.keys(field ?? this.#config.field)
    const isValidField = field ? viewAvailableFieldNames.every(c => datasetAvailableFieldNames.includes(c)) : true
    const isValidFields = fields ? fields.every(s => viewAvailableFieldNames.includes(s)) : true
    const isValidSorts = sorts ? sorts.every(s => viewAvailableFieldNames.includes(s.startsWith('-') ? s.slice(1) : s)) : true
    const isValidFilter = filter ? [...(filter?.and ?? []), ...(filter?.or ?? [])].every(c => viewAvailableFieldNames.includes(Object.keys(c)[0])) : true
    const isValidStickyField = stickyField ? stickyField <= viewAvailableFieldNames.length - 1 : true

    if (!isValidField) throw datasetError('invalidViewField')
    if (!isValidFields) throw datasetError('invalidViewFields')
    if (!isValidSorts) throw datasetError('invalidViewSorts')
    if (!isValidFilter) throw datasetError('invalidViewFilter')
    if (!isValidStickyField) throw datasetError('invalidViewStickyField')
  }

  cleanField(name: string) {
    delete this.#config.field[name]

    if (this.#config.filter?.and) {
      this.#config.filter.and = this.#config.filter.and.filter((condition) => !condition[name])
    }

    if (this.#config.filter?.or) {
      this.#config.filter.or = this.#config.filter.or.filter((condition) => !condition[name])
    }

    this.#config.filter?.or?.forEach((condition) => {
      delete condition[name]
    })
    this.#config.fields = this.#config.fields.filter((_name) => _name !== name) as [string, ...string[]]
    this.#config.sorts = this.#config.sorts.filter((_name) => _name !== name && _name !== `-${name}`) as [string, ...string[]]

    return this
  }

  toSelectQuery(fields = this.#config.fields) {
    const { field } = this.#config
    const select = fields.filter(name => field[name].selected).map(name => {
      if (columnTypeFields.includes(name)) return name

      // flatten object
      return db.raw(':column: -> :field as :field:', {
        column: PARENT_COLUMN,
        field: name
      })
    })

    return select
  }

  toOrderByQuery(sorts = this.#config.sorts) {
    const orderBy = sorts?.map(s => {
      const sort = s.startsWith('-') ? [s.slice(1), 'desc'] : [s, 'asc']
      const [name, direction] = sort

      return {
        column: columnTypeFields.includes(name) ? name : pathToColumn(`${PARENT_COLUMN}.${name}`) as any,
        order: direction
      }
    })

    return orderBy
  }

  toFilterQuery(filter = this.#config.filter) {
    if (!filter) return

    const { and, or } = filter

    if (and) and.forEach(condition => this.transformFieldToPathFromCondition(condition))
    if (or) or.forEach(condition => this.transformFieldToPathFromCondition(condition))

    return filter
  }

  toJSON() {
    return this.#config
  }

  private transformFieldToPathFromCondition(condition: Condition) {
    const name = Object.keys(condition)[0]
    const value = condition[name]

    if (columnTypeFields.includes(name)) return

    condition[`${PARENT_COLUMN}.${name}`] = value
    delete condition[name]
  }
}
