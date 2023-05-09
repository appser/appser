import db from 'core/db'
import { pathToColumn } from 'core/db/helpers/pathToColumn'

import { datasetError } from '../../dataset.error'

import type { Condition } from 'core/db/filter/filter.schema'
import type { TDataset } from 'core/models/dataset'
import type { TView } from 'core/modules/dataset/helpers/view/view.schema'

const columnTypeFields = ['id', 'creator', 'lastEditor', 'createdAt', 'updatedAt']
const PARENT_COLUMN = 'data'

export class View {
  #dataset
  #config

  constructor(config: TView, fromDataset?: Pick<TDataset, 'fields'>) {
    this.#config = config
    this.#dataset = fromDataset
  }

  static getFromDatasetById(dataset: TDataset, viewId: string) {
    const viewIndex = dataset.views.findIndex(view => view.id === viewId)
    const view = dataset.views[viewIndex]

    if (!view) throw datasetError('viewNotFound')

    return { view, viewIndex }
  }

  get dataset() {
    if (!this.#dataset) throw new Error('Dataset of view not found')

    return this.#dataset
  }

  update(config: Partial<TView>) {
    this.validate(config)
    this.#config = Object.assign(this.#config, config)

    return this
  }

  validate(config: Partial<TView>) {
    const { field, fields, filter, sorts, stickyField } = config
    const datasetAvailableFieldNames = Object.keys(this.dataset.fields)
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

  toSelect(customFields?: [string, ...string[]]) {
    const { field } = this.#config
    const fields = customFields ?? this.#config.fields
    const select = fields.filter(name => field[name].selected).map(name => {
      if (columnTypeFields.includes(name)) return name

      return db.raw(':column: -> :field as :field:', {
        column: PARENT_COLUMN,
        field: name
      })
    })

    return select
  }

  toOrderBy(customSorts?: TView['sorts']) {
    const sorts = customSorts ?? this.#config.sorts

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

  toPathFromFilter(customFilter?: TView['filter']) {
    const filter = customFilter ?? this.#config.filter

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
