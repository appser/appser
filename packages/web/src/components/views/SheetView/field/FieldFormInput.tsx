import { Flex, Group, Text } from '@appser/ui'

import { useFieldsConfig } from '../fields'

import type { Field } from './Field'
import type { FieldFormInputProps } from '../fields'
import type { FC } from 'react'

interface Props {
  defaultValue: unknown
  field: Field
  onDone: (v: unknown) => void
}

export const FieldFormInput: FC<Props> = ({ defaultValue, field, onDone }) => {
  const fieldsConfig = useFieldsConfig()
  const FormInput = fieldsConfig[field.type].FormInput as FC<FieldFormInputProps>

  if (!FormInput) return null

  return (
    <Group position='left' spacing="xs" mb='md' w='100%' style={{ alignItems: 'flex-start' }}>
      <Text
        size="sm"
        mih={36}
        align='right'
        w={110}
        display='flex'
        sx={{ alignItems: 'center', justifyContent: 'flex-end' }}
        pr='lg'
      >
        {field.title}
      </Text>

      <Flex sx={{ flex: 1 }} mih={36} align='center'>
        <FormInput
          field={field}
          onDone={onDone}
          defaultValue={defaultValue}
        />
      </Flex>

    </Group>
  )
}
