import type { TRecord } from 'web/servers/dataset/types'

export interface Row {
  rowIndex: number
  pageIndex: number
  recordIndex: number
  record: TRecord
}
