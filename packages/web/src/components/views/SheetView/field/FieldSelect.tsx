import { Group, Select, Text } from '@appser/ui'
import { forwardRef, useMemo } from 'react'

import { FieldTypeIcon } from './FieldTypeIcon'
import { useFields } from '../hooks/useFields'

import type { Field } from './Field'
import type { SelectProps } from '@appser/ui'
import type { FC } from 'react'

interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
  label: string
  Icon: JSX.Element
}
const SelectItem = forwardRef<HTMLDivElement, ItemProps>(({ label, Icon, ...others }, ref) => (
  <div ref={ref} {...others}>
    <Group noWrap>
      {Icon}
      <div>
        <Text size="sm">{label}</Text>
      </div>
    </Group>
  </div>
))

interface Props extends Omit<SelectProps, 'onChange' | 'data'> {
  defaultFieldName?: string
  defaultFields?: Field[]
  onChange?: (field: Field) => void
}

export const FieldSelect: FC<Props> = ({ defaultFieldName, defaultFields, onChange, ...rest }) => {
  const { selectedFields } = useFields()
  const fields = defaultFields ?? selectedFields

  const data = useMemo<({ value: string; label: string; Icon: JSX.Element })[]>(() => fields.map(c => (
    {
      Icon: <FieldTypeIcon type={c.type} size={14} />,
      label: c.title,
      value: c.name
    }
  )), [fields])

  return (
    <Select
      defaultValue={defaultFieldName}
      size='xs'
      onChange={(v) => {
        onChange?.(selectedFields.find(c => c.id === v) as Field)
      }}
      itemComponent={SelectItem}
      maxDropdownHeight={400}
      data={data}
      {...rest}
    />
  )
}
