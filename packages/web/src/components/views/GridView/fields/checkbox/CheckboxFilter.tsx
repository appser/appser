import { Box, Checkbox, Group, Select } from '@mantine/core'
import { useForm } from '@mantine/form'

import type { FieldFilterProps } from '..'
import type { FC } from 'react'

export const CheckboxFilter: FC<FieldFilterProps> = ({ onChange, condition }) => {
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
            onChange?.({ [v]: form.values.value ?? 'false' })
          }
        }}
        data={[{ value: 'eq', label: '=' }]}
      />
      <Box>
        <Checkbox onChange={e => {
          form.setFieldValue('value', `${e.currentTarget.checked}`)
          const k = form.values.operator as string

          if (k) {
            onChange?.({ [k]: `${e.currentTarget.checked}` })
          }
        }}
        />
      </Box>
    </Group>
  )
}
