import { Group } from '@appser/ui'
import { useEffect, useState } from 'react'

import { ColumnSelect } from './ColumnSelect'
import { useFields } from '../fields'
import { useColumns } from '../hooks/useColumns'

import type { Column } from './Column'
import type { FieldSortProps } from '../fields'
import type { FC } from 'react'

type Sort = [string, 'asc' | 'desc']

interface Props {
  sort: Sort
  columns?: Column[]
  onChange?: (sort: Sort) => void
}

export const ColumnSort: FC<Props> = ({ sort, columns, onChange }) => {
  const { visibleColumns } = useColumns()
  const fields = useFields()
  const [_columnName, _direction] = sort
  const [columnName, setColumnName] = useState(_columnName)
  const [direction, setDirection] = useState(_direction)
  const innerColumns = columns ?? visibleColumns
  const column = innerColumns.find(c => c.name === columnName)

  useEffect(() => {
    onChange?.([columnName, direction])
  }, [columnName, direction])

  if (!column) return null

  const field = fields[column.field]
  const FieldSort = field.Sort as FC<FieldSortProps>

  if (!FieldSort) return null

  return (
    <Group>
      <ColumnSelect
        columns={innerColumns}
        defaultColumnName={columnName}
        onChange={column => setColumnName(column.name)}
      />
      <FieldSort
        onChange={d => setDirection(d)}
        direction={direction as 'desc' | 'asc'}
      />
    </Group>
  )
}
