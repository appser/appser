import { Group } from '@appser/ui'
import { useEffect, useMemo, useState } from 'react'

import { ColumnSelect } from './ColumnSelect'
import { useFields } from '../fields'
import { useColumns } from '../hooks/useColumns'

import type { FieldFilterProps } from '../fields'
import type { FC } from 'react'
import type { FilterCondition, FilterConditionOperator, FilterConditionValueDetail } from 'web/servers/dataset/useQueryRecord'

interface Props {
  condition: FilterCondition
  onChange?: (condition: FilterCondition) => void
}

export const ColumnFilter: FC<Props> = ({ condition, onChange }) => {
  const fields = useFields()
  const { visibleColumns } = useColumns()
  const [fieldName, _conditionValue] = Object.entries(condition)[0]
  const initialColumn = visibleColumns.find(c => c.name === fieldName)
  const [column, setColumn] = useState(initialColumn)
  const [conditionValue, setConditionValue] = useState(_conditionValue)
  const conditionValueDetail = useMemo<FilterConditionValueDetail>(() => {
    const [operator, value] = Object.entries(conditionValue)[0] as [FilterConditionOperator, never]

    return {
      operator,
      value
    }
  }, [conditionValue])

  useEffect(() => {
    column && conditionValue && onChange?.({ [column.name]: conditionValue })
  }, [column, conditionValue])

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
        defaultColumnName={fieldName}
        onChange={column => setColumn(column)}
      />
      <FieldFilter
        conditionValueDetail={conditionValueDetail}
        onChange={(v) => setConditionValue({ [v.operator]: v.value })}
      />
    </Group>
  )
}
