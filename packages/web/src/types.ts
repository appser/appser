import type db from './vendor/db'
import type { QueryOptions } from '@tanstack/react-query'

// models
export type TApp = Awaited<ReturnType<typeof db.app.getApp>>
export type TView = Awaited<ReturnType<typeof db.dataset.getView>>
export type TDataset = Awaited<ReturnType<typeof db.dataset.getDataset>>
export type TRecord = {
  id: string
  [key: string]: unknown
}

export type ListRecord = Awaited<ReturnType<typeof db.dataset.listRecord>>

export type Query = Pick<QueryOptions, 'queryFn' | 'queryKey'>
