import { useCheckboxFieldConfig } from './checkbox'
import { useDateFieldConfig } from './date'
import { useEmailFieldConfig } from './email'
import { useMultipleSelectFieldConfig } from './multipleSelect'
import { useNumberFieldConfig } from './number'
import { useNumIdField } from './numId'
import { useSimpleTextField } from './simpleText'
import { useSingleSelectField } from './singleSelect'
import { useURLField } from './url'

import type { Cell } from '../cell/Cell'
import type { SheetField } from '../field/Field'
import type { Row } from '../row/Row'
import type { GridCell, Rectangle, SpriteMap } from '@glideapps/glide-data-grid'
import type { FC, ForwardRefExoticComponent, RefAttributes } from 'react'
import type { DatasetField, FilterConditionOperatorItem } from 'web/types'

export interface FieldFormInputProps<T = unknown> {
  field: SheetField
  denyEdit?: boolean
  defaultData?: T
  onChange?: (data: T) => void
}

export interface FieldFilterOperatorItemProps {
  field: SheetField
  defaultOperatorItem?: FilterConditionOperatorItem
  onChange?: (item: FilterConditionOperatorItem) => void
}

export type FieldSortDirection = 'asc' | 'desc'

export interface FieldSortDirectionProps {
  defaultDirection?: FieldSortDirection
  onChange?: (direction: FieldSortDirection) => void
}

export type FieldCellEditorProps<T extends Cell = Cell> = {
  cell: T
  field: SheetField
  rectangle: Rectangle
  onDone: (data: string | boolean | number | object | undefined) => void
}

export type FieldCellEditorRef = {
  save?: () => void
}

export interface FieldIconProps {
  color: 'currentColor' | string
  size: number
}

export type FieldOptionEditorProps = {
  field: DatasetField
  onChange?: (options: Record<string, unknown>) => void
}

export type FieldConfig<T extends GridCell = GridCell> = {
  /** used to add a record or show record details */
  FormInput?: FC<FieldFormInputProps>
  OptionEditor?: FC<FieldOptionEditorProps>
  CellEditor?: ForwardRefExoticComponent<FieldCellEditorProps<T> & RefAttributes<FieldCellEditorRef>>
  CellEditorFloatingIcon?: FC<{ size: number }>
  FilterOperatorItem: FC<FieldFilterOperatorItemProps>
  SortDirection: FC<FieldSortDirectionProps>
  toCellContent: (args: { row: Row; field: DatasetField; value: unknown }) => T | undefined
  icon: SpriteMap[string]
}

export function useFieldsConfig() {
  const checkbox = useCheckboxFieldConfig()
  const date = useDateFieldConfig()
  const email = useEmailFieldConfig()
  const multipleSelect = useMultipleSelectFieldConfig()
  const number = useNumberFieldConfig()
  const numId = useNumIdField()
  const simpleText = useSimpleTextField()
  const singleSelect = useSingleSelectField()
  const url = useURLField()

  return {
    checkbox,
    date,
    email,
    multipleSelect,
    number,
    numId,
    simpleText,
    singleSelect,
    url
  }
}

export type FieldType = keyof ReturnType<typeof useFieldsConfig>
