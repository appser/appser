import { Group, Menu, Text } from '@mantine/core'
import { useState } from 'react'
import { MenuButton } from 'web/components/common/MenuButton'

import { FieldIcon } from './FieldIcon'
import { useFieldSelectData } from '../hooks/useFieldSelectData'

import type { FieldType } from '../fields'
import type { FC } from 'react'

interface Props {
  defaultField: FieldType
  onChange?: (field: FieldType) => void
}

export const FieldSelect: FC<Props> = ({ defaultField, onChange }) => {
  const data = useFieldSelectData()
  const [isFocus, setIsFocus] = useState(false)
  const [field, setField] = useState<typeof data[number] | null>(null)

  return (
    <Menu
      width={240}
      position="bottom-end"
      shadow="md"
      offset={13}
      onChange={s => setIsFocus(s)}
    >
      <Menu.Target>
        <MenuButton placeholder="Choose field">
          {field && (
          <Group spacing={2}>
            <FieldIcon type={field.value} />
            <Text>{field.label}</Text>
          </Group>
          )}
        </MenuButton>
      </Menu.Target>
      <Menu.Dropdown p={8}>
        <Menu.Label>Choose field</Menu.Label>
        {data.map((field) => (
          <Menu.Item
            key={field.value}
            icon={<FieldIcon type={field.value} />}
            onClick={() => {
              onChange?.(field.value)
              setField(field)
            }}
          >
            {field.label}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  )
}
