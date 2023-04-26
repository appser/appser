import type { TView } from 'backend/models/dataset/view.schema'

export default function cleanViewColumn(view: TView, columnName: string) {
  delete view.column[columnName]

  // clean filter
  if (view.filter?.and) {
    view.filter.and = view.filter.and.filter((condition) => !condition[columnName])
  }

  if (view.filter?.or) {
    view.filter.or = view.filter.or.filter((condition) => !condition[columnName])
  }

  view.filter?.or?.forEach((condition) => {
    delete condition[columnName]
  })
  view.columns = view.columns.filter((name) => name !== columnName) as [string, ...string[]]
  view.sorts = view.sorts.filter((name) => name !== columnName && name !== `-${columnName}`) as [string, ...string[]]

  return view
}
