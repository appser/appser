import { useForm } from '@appser/ui/form'
import { useEffect, useMemo } from 'react'
import { FormSection } from 'web/components/common/FormSection'

import type { FieldOptionEditorProps } from '..'
import type { FC } from 'react'

export const DateOptionEditor: FC<FieldOptionEditorProps> = ({ onChange, field }) => {
  const form = useForm({
    initialValues: field.type === 'date'
      ? field.options
      : {
          calendar: 'gregory',
          dateStyle: 'short',
          timeStyle: 'short'
        }
  })

  const calendarSelectData = useMemo(() => ([
    {
      label: 'Gregory',
      value: 'gregory'
    },
    {
      label: 'Chinese',
      value: 'chinese'
    },
    {
      label: 'Japanese',
      value: 'japanese'
    }
  ]), [])

  const formatSelectData = useMemo(() => ([
    {
      label: 'YYYY-MM-DD',
      value: 'short,short'
    }
  ]), [])

  useEffect(() => onChange?.(form.values), [form.values])

  return (
    <FormSection title="Options" mt="md">
      <FormSection.Select
        label='Calendar'
        defaultValue={form.values.calendar}
        data={calendarSelectData}
        w={100}
        onChange={v => form.setFieldValue('precision', Number(v))}
      />
      <FormSection.Divider />
      <FormSection.Select
        label='Formatter'
        defaultValue={[form.values.dateStyle, form.values.timeStyle].join(',')}
        data={formatSelectData}
        w={100}
        onChange={v => {
          if (!v) return
          const [dateStyle, timeStyle] = v.split(',')
          form.setFieldValue('dateStyle', dateStyle)
          form.setFieldValue('timeStyle', timeStyle)
        }}
      />
    </FormSection>
  )
}
