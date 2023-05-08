import type { TView } from 'backend/models/dataset/view.schema'

export default function cleanFieldFromView(fieldName: string, view: TView) {
  delete view.field[fieldName]

  // clean filter
  if (view.filter?.and) {
    view.filter.and = view.filter.and.filter((condition) => !condition[fieldName])
  }

  if (view.filter?.or) {
    view.filter.or = view.filter.or.filter((condition) => !condition[fieldName])
  }

  view.filter?.or?.forEach((condition) => {
    delete condition[fieldName]
  })
  view.fields = view.fields.filter((name) => name !== fieldName) as [string, ...string[]]
  view.sorts = view.sorts.filter((name) => name !== fieldName && name !== `-${fieldName}`) as [string, ...string[]]

  return view
}
