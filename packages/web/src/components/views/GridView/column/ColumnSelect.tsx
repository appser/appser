import { Group, Select, Text } from '@mantine/core'
import { forwardRef, useMemo } from 'react'

import { FieldIcon } from '../field/FieldIcon'
import { useColumns } from '../hooks/useColumns'

import type { Column } from './Column'
import type { SelectProps } from '@mantine/core'
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
  defaultColumnName?: string
  columns?: Column[]
  onChange?: (column: Column) => void
}

export const ColumnSelect: FC<Props> = ({ defaultColumnName, columns, onChange, ...rest }) => {
  const { visibleColumns } = useColumns()
  const innerColumns = columns ?? visibleColumns

  const selectData = useMemo<({ value: string; label: string; Icon: JSX.Element })[]>(() => innerColumns.map(c => (
    {
      label: c.title,
      Icon: <FieldIcon type={c.field} size={14} />,
      value: c.name
    }
  )), [innerColumns])

  return (
    <Select
      defaultValue={defaultColumnName}
      size='xs'
      onChange={(v) => {
        onChange?.(visibleColumns.find(c => c.id === v) as Column)
      }}
      itemComponent={SelectItem}
      maxDropdownHeight={400}
      data={selectData}
      {...rest}
    />
  )
}
