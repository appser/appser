import { Group } from '@mantine/core'
import { useEffect, useMemo, useState } from 'react'

import { FieldSelect } from './FieldSelect'
import { useFieldsConfig } from '../fields'
import { useFields } from '../hooks/useFields'

import type { FieldFilterOperatorItemProps } from '../fields'
import type { FC } from 'react'
import type { FilterCondition, FilterConditionOperatorItem, FilterConditionOperatorType } from 'web/types'

interface Props {
  defaultCondition?: FilterCondition
  onChange?: (condition: FilterCondition) => void
}

export const FieldFilterCondition: FC<Props> = ({ defaultCondition = [], onChange }) => {
  const fieldConfigStore = useFieldsConfig()
  const { selectedFields } = useFields()
  const [fieldName, initialOperator] = Object.entries(defaultCondition)[0]
  const [operator, setOperator] = useState(initialOperator)
  const initialField = selectedFields.find(c => c.name === fieldName)
  const [field, setField] = useState(initialField)
  const operatorItem = useMemo<FilterConditionOperatorItem>(() => {
    const item = Object.entries(operator)?.[0] ?? []
    const [type, value] = item as [FilterConditionOperatorType, never]

    return {
      type,
      value
    }
  }, [operator])

  useEffect(() => {
    field && operator && onChange?.({ [field.name]: operator })
  }, [field, operator])

  if (!field) return null

  const FieldFilterOperatorItem = fieldConfigStore[field.type].FilterOperatorItem as FC<FieldFilterOperatorItemProps>

  if (!FieldFilterOperatorItem) return null

  return (
    <Group spacing={0} noWrap>
      <FieldSelect
        w={160}
        size='sm'
        defaultFieldName={fieldName}
        onChange={field => setField(field)}
      />
      <FieldFilterOperatorItem
        field={field}
        defaultOperatorItem={operatorItem}
        onChange={(v) => setOperator({ [v.type]: v.value })}
      />
    </Group>
  )
}
