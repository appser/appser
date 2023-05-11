import { Loader } from '@appser/ui'
import React, { Suspense, forwardRef, useImperativeHandle, useState } from 'react'

import type { FieldCellEditorProps, FieldCellEditorRef } from '..'
import type { TextCell } from '@glideapps/glide-data-grid'
import type { ForwardRefRenderFunction } from 'react'

// TODO:bugfix
const DatePicker = React.lazy(() => import('@appser/ui/dates').then((module) => ({ default: module.DatePickerInput })))

const DateCellEditorImpl: ForwardRefRenderFunction<FieldCellEditorRef, FieldCellEditorProps<TextCell> > = (
  { cell, field, rectangle, onDone },
  forwardedRef
) => {
  const [data, setData] = useState<string>('')
  const [opened, setOpened] = useState(true)

  const save = () => {
    onDone(data)
  }

  useImperativeHandle(forwardedRef, () => ({
    save
  }))

  return (
    <Suspense fallback={<Loader size="xs" />}>
      <DatePicker
        variant='unstyled'
        styles={() => ({
          wrapper: {
            height: '100%'
          },
          input: {
            height: '100%'
          }
        })}
        onChange={() => setOpened(false)}
        onClick={() => setOpened(true)}
        placeholder="Pick date"
        popoverProps={{
          opened
        }}
      />
    </Suspense>
  )
}

export const DateCellEditor = forwardRef(DateCellEditorImpl)
