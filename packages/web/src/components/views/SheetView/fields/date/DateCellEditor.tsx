import { Loader } from '@appser/ui'
import { useForm } from '@appser/ui/form'
import React, { Suspense, forwardRef, useEffect, useImperativeHandle, useState } from 'react'

import type { FieldCellEditorProps, FieldCellEditorRef } from '..'
import type { TextCell } from '@glideapps/glide-data-grid'
import type { ForwardRefRenderFunction } from 'react'

const DatePickerInput = React.lazy(() => import('@appser/ui/dates').then((module) => ({ default: module.DatePickerInput })))

const DateCellEditorImpl: ForwardRefRenderFunction<FieldCellEditorRef, FieldCellEditorProps<TextCell> > = (
  { cell, defaultValue, onDone },
  forwardedRef
) => {
  // const [date, setDate] = useState<Date | null>()
  const [opened, setOpened] = useState(true)
  const form = useForm({
    initialValues: {
      date: typeof defaultValue === 'number' ? new Date(defaultValue) : null
    }
  })

  useImperativeHandle(forwardedRef, () => ({
    save() {
      onDone?.(form.values.date?.valueOf())
    }
  }))

  useEffect(() => {
    if (form.isDirty()) {
      onDone?.(form.values.date?.valueOf())
    }
  }, [form.values])

  return (
    <Suspense fallback={<Loader size="xs" />}>
      <DatePickerInput
        variant='unstyled'
        styles={() => ({
          wrapper: {
            height: '100%'
          },
          input: {
            height: '100%'
          }
        })}
        defaultValue={form.values.date}
        onChange={(v) => form.setFieldValue('date', v)}
        placeholder="Pick date"
        popoverProps={{
          opened: true
        }}
      />
    </Suspense>
  )
}

export const DateCellEditor = forwardRef(DateCellEditorImpl)
