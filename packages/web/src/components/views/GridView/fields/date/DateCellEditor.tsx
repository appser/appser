import { Loader } from '@appser/ui'
import React, { Suspense, forwardRef, useImperativeHandle, useState } from 'react'

import type { FieldCellEditorProps, FieldCellEditorRef } from '..'
import type { TextCell } from '@glideapps/glide-data-grid'
import type { ForwardRefRenderFunction } from 'react'

const DatePicker = React.lazy(() => import('@mantine/dates').then((module) => ({ default: module.DatePickerInput })))

const DateCellEditorImpl: ForwardRefRenderFunction<FieldCellEditorRef, FieldCellEditorProps<TextCell> > = (
  { cell, column, rectangle, onDone },
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

  if (column.field !== 'date') throw new Error('DateCellEditor used for non-date column')

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
