import type { TView } from 'core/models/dataset/view.schema'

export function validateViewFields(view: TView, availableFieldNames: string[]) {
  const viewFields = Object.keys(view.field)
  const validateField = viewFields.every(c => availableFieldNames.includes(c))
  const validateFields = view.fields.every(s => viewFields.includes(s))
  const validateSorts = view.sorts.every(s => viewFields.includes(s.startsWith('-') ? s.slice(1) : s))
  const validateFilter = [...(view.filter?.and ?? []), ...(view.filter?.or ?? [])].every(c => viewFields.includes(Object.keys(c)[0]))
  const validateStickyField = view.stickyField <= viewFields.length - 1

  return validateField && validateFields && validateSorts && validateFilter && validateStickyField
}
