import { useCheckboxField } from './checkbox'
import { useDateField } from './date'
import { useEmailField } from './email'
import { useMultipleSelectField } from './multipleSelect'
import { useNumberField } from './number'
import { useNumIdField } from './numId'
import { useSimpleTextField } from './simpleText'
import { useSingleSelectField } from './singleSelect'
import { useURLField } from './url'

import type { Cell } from '../cell/Cell'
import type { Column, DatasetColumn } from '../column/Column'
import type { Row } from '../row/Row'
import type { GridCell, Rectangle, SpriteMap } from '@glideapps/glide-data-grid'
import type { FC, ForwardRefExoticComponent, RefAttributes } from 'react'
import type { FilterConditionItem } from 'web/servers/dataset/useQueryRecord'

export interface FieldColumnInputProps<T=unknown> {
  data?: T
  column: Column
  denyEdit?: boolean
  onChange?: (data: T) => void
}

export interface FieldFilterProps {
  condition?: FilterConditionItem
  onChange?: (condition: FilterConditionItem) => void
}

export type FieldSortDirection = 'asc' | 'desc'

export interface FieldSortProps {
  direction?: FieldSortDirection
  onChange?: (direction: FieldSortDirection) => void
}

export type FieldCellEditorProps<T extends Cell = Cell> = {
  cell: T
  column: Column
  rectangle: Rectangle
  onDone: (data: string | boolean | number | object | undefined) => void
}

export type FieldCellEditorRef = {
  done?: () => void
}

export interface FieldIconProps {
  color: 'currentColor' | string
  size: number
}

export type FieldOptionEditorProps = {
  column: DatasetColumn
  onChange?: (options: Record<string, unknown>) => void
}

export type FieldConfig<T extends GridCell = GridCell> = {
  OptionEditor?: FC<FieldOptionEditorProps>
  CellEditor?: ForwardRefExoticComponent<FieldCellEditorProps<T> & RefAttributes<FieldCellEditorRef>>
  CellEditorFloatingIcon?: FC<{ size: number }>
  ColumnInput?: FC<any>
  Filter: FC<FieldFilterProps>
  Sort: FC<FieldSortProps>
  toCellContent: (args: { row: Row; column: DatasetColumn; value: unknown }) => T | undefined
  icon: SpriteMap[string]
}

export function useFields() {
  const checkbox = useCheckboxField()
  const date = useDateField()
  const email = useEmailField()
  const multipleSelect = useMultipleSelectField()
  const number = useNumberField()
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

export type FieldType = keyof ReturnType<typeof useFields>
