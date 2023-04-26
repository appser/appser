import { TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { forwardRef, useImperativeHandle } from 'react'

import type { FieldCellEditorProps, FieldCellEditorRef } from '..'
import type { TextCell } from '@glideapps/glide-data-grid'
import type { ForwardRefRenderFunction } from 'react'

const URLCellEditorImpl: ForwardRefRenderFunction<FieldCellEditorRef, FieldCellEditorProps<TextCell>> = (
  { cell, column, onDone },
  forwardedRef
) => {
  const form = useForm({
    initialValues: {
      data: cell.data
    }
  })

  const save = () => {
    onDone(form.values.data)
  }

  useImperativeHandle(forwardedRef, () => ({
    save
  }))

  return (
    <TextInput
      autoFocus
      variant='unstyled'
      {...form.getInputProps('data')}
    />
  )
}

export const URLCellEditor = forwardRef(URLCellEditorImpl)
