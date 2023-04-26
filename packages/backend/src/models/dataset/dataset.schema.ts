import { Dataset } from '.'

export const safeDatasetSchema = Dataset.schema.refine(dataset => {
  const datasetColumns = Object.keys(dataset.column)

  return dataset.views.every(view => {
    const viewColumns = Object.keys(view.column)
    const validateColumn = viewColumns.every(c => datasetColumns.includes(c))
    const validateColumns = view.columns.every(s => viewColumns.includes(s))
    const validateSorts = view.sorts.every(s => viewColumns.includes(s.startsWith('-') ? s.slice(1) : s))
    const validateFilter = view.filter ? Object.keys(view.filter).every(f => viewColumns.includes(f)) : true
    const validateStickyColumn = view.stickyColumn <= viewColumns.length - 1

    return validateColumn && validateColumns && validateSorts && validateFilter && validateStickyColumn
  })
}, {
  message: 'dataset column, view column, sorts, filter, selects or stickyColumn is not match column'
})
