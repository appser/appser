import type { GridColumn } from '@glideapps/glide-data-grid'
import type { TDataset, TView } from 'web/servers/dataset/types'

export type DatasetColumn = TDataset['column'][string] & {
  name: string
}

export type ViewColumn = TView['column'][string]

export type Column = DatasetColumn & ViewColumn & GridColumn
