import type db from './vendor/db'

export type Org = Awaited<ReturnType<typeof db.org.getOrg>>
export type Role = Awaited<ReturnType<typeof db.org.listOrgRole>>[number]
export type App = Awaited<ReturnType<typeof db.app.getApp>>
export type View = Awaited<ReturnType<typeof db.dataset.getView>>
export type Dataset = Awaited<ReturnType<typeof db.dataset.getDataset>>
export type Record = {
  id: string
  [key: string]: unknown
}

// field
export type DatasetField = Dataset['field'][string] & { name: string }
export type ViewField = View['field'][string]

// filter
export type Filter = NonNullable<Parameters<typeof db.dataset.queryViewRecord>[0]['requestBody']['filter']>
export type FilterConfig = {
  logic: 'and' | 'or'
  conditions: FilterCondition[]
}
export type FilterCondition = NonNullable<Filter[keyof Filter]>[number]
export type FilterConditionOperator = FilterCondition[string]
export type FilterConditionOperatorType = keyof FilterConditionOperator
export type FilterConditionOperatorItem = {
  type: FilterConditionOperatorType
  value: FilterConditionOperator[FilterConditionOperatorType]
}
