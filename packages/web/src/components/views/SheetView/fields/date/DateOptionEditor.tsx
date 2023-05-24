import { useEffect, useMemo, useState } from 'react'
import { FormSection } from 'web/components/common/FormSection'
import { useLocale } from 'web/hooks/ui/useLocale'

import type { FieldOptionEditorProps } from '..'
import type { FC } from 'react'

export const DateOptionEditor: FC<FieldOptionEditorProps> = ({ onChange, field }) => {
  const [locale] = useLocale()
  const [includeTime, setIncludeTime] = useState(Boolean(field.options?.timeStyle))
  const [dateStyle, setDateStyle] = useState(field.options?.dateStyle)
  const [timeStyle, setTimeStyle] = useState(field.options?.timeStyle)

  const dateStyleData = useMemo(() => ([
    {
      label: new Intl.DateTimeFormat(`${locale.language}-u-ca-${locale.calendar}`, {
        dateStyle: 'short',
        timeStyle: undefined
      }).format(new Date()),
      value: 'short'
    },
    {
      label: new Intl.DateTimeFormat(`${locale.language}-u-ca-${locale.calendar}`, {
        dateStyle: 'medium',
        timeStyle: undefined
      }).format(new Date()),
      value: 'medium'
    },
    {
      label: new Intl.DateTimeFormat(`${locale.language}-u-ca-${locale.calendar}`, {
        dateStyle: 'full',
        timeStyle: undefined
      }).format(new Date()),
      value: 'full'
    }
  ]), [locale])

  const timeStyleData = useMemo(() => ([
    {
      label: new Intl.DateTimeFormat(`${locale.language}-u-ca-${locale.calendar}`, {
        dateStyle: undefined,
        timeStyle: 'short'
      }).format(new Date()),
      value: 'short'
    },
    {
      label: new Intl.DateTimeFormat(`${locale.language}-u-ca-${locale.calendar}`, {
        dateStyle: undefined,
        timeStyle: 'medium'
      }).format(new Date()),
      value: 'medium'
    },
    {
      label: new Intl.DateTimeFormat(`${locale.language}-u-ca-${locale.calendar}`, {
        dateStyle: undefined,
        timeStyle: 'long'
      }).format(new Date()),
      value: 'long'
    }
  ]), [locale])

  useEffect(() => {
    onChange?.({
      dateStyle,
      timeStyle: includeTime ? timeStyle : undefined
    })
  }, [dateStyle, timeStyle, includeTime])

  return (
    <FormSection title="Options" mt="md">
      <FormSection.Select
        label='Date Formatter'
        defaultValue={dateStyle}
        data={dateStyleData}
        w={100}
        onChange={v => v && setDateStyle(v)}
      />
      <FormSection.Switch label="Include time" checked={includeTime} onChange={v => setIncludeTime(v.currentTarget.checked)} />
      {includeTime && (
        <FormSection.Select
          label='Time Formatter'
          defaultValue={timeStyle}
          data={timeStyleData}
          w={100}
          onChange={v => v && setTimeStyle(v)}
        />
      )}
      <FormSection.Divider />
    </FormSection>
  )
}
