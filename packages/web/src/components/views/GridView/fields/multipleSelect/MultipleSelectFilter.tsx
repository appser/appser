import { Group, MultiSelect, Select } from '@appser/ui'
import { useForm } from '@appser/ui'

import type { FieldFilterProps } from '..'
import type { FC } from 'react'

export const MultipleSelectFilter: FC<FieldFilterProps> = ({ column, onChange, condition }) => {
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

      <MultiSelect
        data={['React', 'Angular', 'Svelte', 'Vue', 'Riot', 'Next.js', 'Blitz.js']}
        placeholder="Pick all that you like"
        defaultValue={['react', 'next']}
        clearButtonLabel="Clear selection"
        clearable
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
          form.setFieldValue('value', v.toString())
          const k = form.values.operator as string
          if (k){
            onChange?.({[k]: v.toString()})
          }
        }}
      />
    </Group>
  )
}
