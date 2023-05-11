import { Group } from '@appser/ui'
import { useEffect, useState } from 'react'

import { FieldSelect } from './FieldSelect'
import { useFieldsConfig } from '../fields'
import { useFields } from '../hooks/useFields'

import type { Field } from './Field'
import type { FieldSortDirectionProps } from '../fields'
import type { FC } from 'react'

type Sort = [string, 'asc' | 'desc']

interface Props {
  sort: Sort
  defaultFields?: Field[]
  onChange?: (sort: Sort) => void
}

export const FieldSort: FC<Props> = ({ sort, defaultFields, onChange }) => {
  const fieldsConfig = useFieldsConfig()
  const { selectedFields } = useFields()
  const [initialName, initialDirection] = sort
  const [name, setName] = useState(initialName)
  const [direction, setDirection] = useState(initialDirection)
  const fields = defaultFields ?? selectedFields
  const field = fields.find(c => c.name === name)

  useEffect(() => {
    onChange?.([name, direction])
  }, [name, direction])

  if (!field) return null

  const FieldSortDirection = fieldsConfig[field.type].SortDirection as FC<FieldSortDirectionProps>

  if (!FieldSortDirection) return null

  return (
    <Group>
      <FieldSelect
        defaultFields={fields}
        defaultFieldName={name}
        onChange={field => setName(field.name)}
      />
      <FieldSortDirection
        defaultDirection={direction as 'desc' | 'asc'}
        onChange={d => setDirection(d)}
      />
    </Group>
  )
}
