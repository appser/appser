import { Group, NumberInput, Select } from '@mantine/core'
import { useForm } from '@mantine/form'

import type { FieldFilterProps } from '..'
import type { FC } from 'react'

export const NumberFilter: FC<FieldFilterProps> = ({ column, onChange, condition }) => {
  const form = useForm({
    initialValues: {
      operator: condition?.operator,
      value: condition?.value
    }
  })

  return (
    <Group spacing={0} noWrap>
      <Select
        w={100}
        styles={{
          root: {
            left: -1,
            position: 'relative',
            '&:focus-within': {
              zIndex: 1
            }
          },
          input: {
            borderRadius: 0
          }
        }}
        onChange={v => {
          if (v) {
            v && form.setFieldValue('operator', v)
            onChange?.({ [v]: form.values.value ?? '' })
          }
        }}
        data={[{ value: 'eq', label: '=' }]}
      />
      <NumberInput styles={{
        root: {
          left: -2,
          position: 'relative',
          '&:focus-within': {
            zIndex: 1
          }
        },
        input: {
          borderRadius: 0
        }
      }}
        onInput={(e) => {
          const v = e.currentTarget.value

          if (v) {
            form.setFieldValue('value', v)
            const k = form.values.operator as string

            if (k) {
              onChange?.({ [k]: v })
            }
          }
        }}
      />
    </Group>
  )
}
