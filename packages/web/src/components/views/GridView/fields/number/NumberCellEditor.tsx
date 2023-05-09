import { NumberInput } from '@appser/ui'
import { useForm } from '@appser/ui'
import { forwardRef, useImperativeHandle } from 'react'

import type { FieldCellEditorProps, FieldCellEditorRef } from '..'
import type { NumberCell } from '@glideapps/glide-data-grid'
import type { ForwardRefRenderFunction } from 'react'

const NumberCellEditorImpl: ForwardRefRenderFunction<FieldCellEditorRef, FieldCellEditorProps<NumberCell> > = (
  { cell, column, rectangle, onDone },
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
    done: save
  }))

  return (
    <NumberInput
      variant='unstyled'
      {...form.getInputProps('data')}
    />
  )
}

export const NumberCellEditor = forwardRef(NumberCellEditorImpl)
