import type { TView } from 'backend/models/dataset/view.schema'

export function validateViewColumns(view: TView, availableColumnNames: string[]) {
  const viewColumns = Object.keys(view.column)
  const validateColumn = viewColumns.every(c => availableColumnNames.includes(c))
  const validateColumns = view.columns.every(s => viewColumns.includes(s))
  const validateSorts = view.sorts.every(s => viewColumns.includes(s.startsWith('-') ? s.slice(1) : s))
  const validateFilter = [...(view.filter?.and ?? []), ...(view.filter?.or ?? [])].every(c => viewColumns.includes(Object.keys(c)[0]))
  const validateStickyColumn = view.stickyColumn <= viewColumns.length - 1

  return validateColumn && validateColumns && validateSorts && validateFilter && validateStickyColumn
}
