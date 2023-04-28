import { Flex, Group, Text } from '@appser/ui'

import { FieldIcon } from '../field/FieldIcon'
import { useFields } from '../fields'

import type { FieldColumnInputProps } from '../fields'
import type { FlexProps } from '@appser/ui'
import type { FC } from 'react'

type ColumnInputProps = FieldColumnInputProps & FlexProps & {
  labelWidth?: number
}

export const ColumnInput: FC<ColumnInputProps> = ({ labelWidth: labelWith = 110, column, data, onChange, ...rest }) => {
  const fields = useFields()
  const field = fields[column.field]
  const FieldColumnInput = field.ColumnInput as FC<FieldColumnInputProps>

  if (!FieldColumnInput) return null

  return (
    <Group position='left' spacing="xs" mb='md' w='100%' style={{ alignItems: 'flex-start' }}>
      <Text
        size="sm"
        mih={36}
        align='right'
        w={labelWith}
        display='flex'
        sx={{ alignItems: 'center', justifyContent: 'flex-end' }}
        pr='lg'
      >
        {column.title}
      </Text>

      <Flex sx={{ flex: 1 }} mih={36} align='center'>
        <FieldColumnInput column={column} onChange={onChange} data={data} />
      </Flex>

    </Group>
  )
}
