import { NumberInput } from '@appser/ui'
import { useForm } from '@appser/ui/form'
import { forwardRef, useImperativeHandle } from 'react'

import type { FieldCellEditorProps, FieldCellEditorRef } from '..'
import type { NumberCell } from '@glideapps/glide-data-grid'
import type { ForwardRefRenderFunction } from 'react'

const NumberCellEditorImpl: ForwardRefRenderFunction<FieldCellEditorRef, FieldCellEditorProps<NumberCell> > = (
  { cell, field, rectangle, onDone },
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
    <NumberInput
      variant='unstyled'
      {...form.getInputProps('data')}
    />
  )
}

export const NumberCellEditor = forwardRef(NumberCellEditorImpl)
