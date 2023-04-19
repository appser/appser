import type db from 'web/vendor/db'

export type TView = Awaited<ReturnType<typeof db.dataset.getView>>

export type TDataset = Awaited<ReturnType<typeof db.dataset.getDataset>>

export type TRecord = {
  id: string
  [key: string]: unknown
}
