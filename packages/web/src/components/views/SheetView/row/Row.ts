import type { Record } from 'web/types'

export interface Row {
  rowIndex: number
  pageIndex: number
  recordIndex: number
  record: Record
}
