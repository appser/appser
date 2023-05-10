import { Flex, Group, Text } from '@appser/ui'

import { useFieldsConfig } from '../fields'

import type { FieldFormInputProps } from '../fields'
import type { FlexProps } from '@appser/ui'
import type { FC } from 'react'

type Props = FieldFormInputProps & FlexProps & {
  labelWidth?: number
}

export const FieldFormInput: FC<Props> = ({
  labelWidth: labelWith = 110,
  field,
  defaultData,
  onChange,
  ...rest
}) => {
  const fieldsConfig = useFieldsConfig()
  const FieldInput = fieldsConfig[field.type].FormInput as FC<FieldFormInputProps>

  if (!FieldInput) return null

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
        {field.title}
      </Text>

      <Flex sx={{ flex: 1 }} mih={36} align='center'>
        <FieldInput field={field} onChange={onChange} defaultData={defaultData} />
      </Flex>

    </Group>
  )
}
