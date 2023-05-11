import type { GridColumn } from '@glideapps/glide-data-grid'
import type { DatasetField, ViewField } from 'web/types'

export type Field = DatasetField & ViewField & GridColumn
