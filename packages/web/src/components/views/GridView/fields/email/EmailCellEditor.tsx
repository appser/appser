import { TextInput } from '@mantine/core'
import { forwardRef, useImperativeHandle, useState } from 'react'

import type { FieldCellEditorProps, FieldCellEditorRef } from '..'
import type { TextCell } from '@glideapps/glide-data-grid'
import type { ForwardRefRenderFunction } from 'react'

const EmailCellEditorImpl: ForwardRefRenderFunction<FieldCellEditorRef, FieldCellEditorProps<TextCell> > = (
  { cell, column, rectangle, onDone },
  forwardedRef
) => {
  const [data, setData] = useState<string>('')

  const save = () => {
    onDone(data)
  }

  useImperativeHandle(forwardedRef, () => ({
    save
  }))

  return (
    <TextInput autoFocus variant='unstyled' />
  )
}

export const EmailCellEditor = forwardRef(EmailCellEditorImpl)
