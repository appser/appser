import { Group, Text } from '@mantine/core'
import { useEffect, useState } from 'react'

import { ColumnSelect } from './ColumnSelect'
import { useFields } from '../fields'
import { useColumns } from '../hooks/useColumns'

import type { FieldFilterProps } from '../fields'
import type { FC } from 'react'
import type { Filter } from 'web/servers/dataset/useQueryRecord'

interface Props {
  filter: Filter
  onChange?: (filter: Filter) => void
}

export const ColumnFilter: FC<Props> = ({ filter, onChange }) => {
  const fields = useFields()
  const { visibleColumns } = useColumns()
  const [columnName, _condition] = Object.entries(filter)[0]
  const initialColumn = visibleColumns.find(c => c.name === columnName)
  const [column, setColumn] = useState(initialColumn)
  const [condition, setCondition] = useState(_condition)

  useEffect(() => {
    column && condition && onChange?.({ [column.name]: condition })
  }, [column, condition])

  if (!column) return null

  const field = fields[column.field]
  const FieldFilter = field.Filter as FC<FieldFilterProps>

  if (!FieldFilter) return null

  return (
    <Group spacing={0} noWrap>
      <ColumnSelect w={160}
        styles={{
          root: {
            '&:focus-within': {
              zIndex: 1
            }
          },
          input: {
            borderRadius: 0
          }
        }}
        size='sm'
        defaultColumnName={columnName}
        onChange={column => setColumn(column)}
      />
      <FieldFilter
        condition={condition}
        onChange={(v) => setCondition(v)}
      />
    </Group>
  )
}
