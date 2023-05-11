import { TextInput } from '@appser/ui'
import { forwardRef, useImperativeHandle, useState } from 'react'

import type { FieldCellEditorProps, FieldCellEditorRef } from '..'
import type { TextCell } from '@glideapps/glide-data-grid'
import type { ForwardRefRenderFunction } from 'react'

const EmailCellEditorImpl: ForwardRefRenderFunction<FieldCellEditorRef, FieldCellEditorProps<TextCell> > = (
  { cell, defaultValue, onDone },
  forwardedRef
) => {
  const [data, setData] = useState<string>('')

  const save = () => {
    onDone?.(data)
  }

  useImperativeHandle(forwardedRef, () => ({
    save
  }))

  return (
    <TextInput
      autoFocus
      variant='unstyled'
    />
  )
}

export const EmailCellEditor = forwardRef(EmailCellEditorImpl)
