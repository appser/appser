import { useForm } from '@appser/ui/form'
import { useEffect, useMemo } from 'react'
import { FormSection } from 'web/components/common/FormSection'

import type { FieldOptionEditorProps } from '..'
import type { FC } from 'react'

export const NumberOptionEditor: FC<FieldOptionEditorProps> = ({ onChange, field }) => {
  const form = useForm({
    initialValues: field.type === 'number'
      ? field.options
      : {
          precision: 0,
          allowNegative: false
        }
  })

  const data = useMemo(() => ([
    {
      label: '0',
      value: '0'
    },
    {
      label: '1.0',
      value: '1'
    },
    {
      label: '1.00',
      value: '2'
    },
    {
      label: '1.000',
      value: '3'
    },
    {
      label: '1.0000',
      value: '4'
    }
  ]), [form.values])

  useEffect(() => onChange?.(form.values), [form.values])

  return (
    <FormSection title="Options" mt="md">
      <FormSection.Select
        label='Precision'
        defaultValue={form.values.precision?.toString()}
        data={data}
        w={100}
        onChange={v => form.setFieldValue('precision', Number(v))}
      />
      <FormSection.Divider />
      <FormSection.Switch
        label='Allow negative'
        checked={form.values.allowNegative}
        onChange={e => form.setFieldValue('allowNegative', e.currentTarget.checked)}
      />
    </FormSection>
  )
}
