import { Group, MultiSelect, Select } from '@appser/ui'
import { useForm } from '@appser/ui'

import type { FieldFilterProps } from '..'
import type { FC } from 'react'

export const SingleSelectFilter: FC<FieldFilterProps> = ({ column, onChange, condition }) => {
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

      <Select
        styles={{
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
        onChange={v => {
          form.setFieldValue('value', v ?? '')
          const k = form.values.operator as string

          if (k) {
            onChange?.({ [k]: v ?? '' })
          }
        }}
        data={['React', 'Angular', 'Svelte', 'Vue', 'Riot', 'Next.js', 'Blitz.js']}
        placeholder="Pick all that you like"
        clearButtonLabel="Clear selection"
        clearable
      />
    </Group>
  )
}
