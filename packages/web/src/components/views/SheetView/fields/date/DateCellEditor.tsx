import { Loader } from '@appser/ui'
import React, { Suspense, forwardRef, useImperativeHandle, useState } from 'react'

import type { FieldCellEditorProps, FieldCellEditorRef } from '..'
import type { TextCell } from '@glideapps/glide-data-grid'
import type { ForwardRefRenderFunction } from 'react'

const DateInput = React.lazy(() => import('@appser/ui/dates').then((module) => ({ default: module.DateInput })))

const DateCellEditorImpl: ForwardRefRenderFunction<FieldCellEditorRef, FieldCellEditorProps<TextCell> > = (
  { cell, defaultValue, onDone },
  forwardedRef
) => {
  const [date, setDate] = useState<Date | null>(typeof defaultValue === 'number' ? new Date(defaultValue) : null)

  useImperativeHandle(forwardedRef, () => ({
    save() {
      onDone?.(date?.valueOf())
    }
  }))

  return (
    <Suspense fallback={<Loader size="xs" />}>
      <DateInput
        variant='unstyled'
        allowDeselect
        value={date}
        onChange={(v) => setDate(v)}
        placeholder="Pick date"
        popoverProps={{
          opened: true
        }}
      />
    </Suspense>
  )
}

export const DateCellEditor = forwardRef(DateCellEditorImpl)
