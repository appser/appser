import { MultiSelect } from '@appser/ui'
import { forwardRef, useImperativeHandle, useState } from 'react'

import type { FieldCellEditorProps, FieldCellEditorRef } from '..'
import type { BubbleCell } from '@glideapps/glide-data-grid'
import type { ForwardRefRenderFunction } from 'react'

// TODO @tccsg
const MultipleSelectCellEditorImpl: ForwardRefRenderFunction<FieldCellEditorRef, FieldCellEditorProps<BubbleCell> > = (
  { cell, column, rectangle, onDone },
  forwardedRef
) => {
  const [data, setData] = useState<string>('')

  const save = () => {
    onDone(data)
  }

  useImperativeHandle(forwardedRef, () => ({
    done: save
  }))

  return (
    <MultiSelect
      data={['React', 'Angular', 'Svelte', 'Vue', 'Riot', 'Next.js', 'Blitz.js']}
      placeholder="Pick all that you like"
      defaultValue={['react', 'next']}
      clearButtonLabel="Clear selection"
      initiallyOpened
      clearable
      variant='unstyled'
    />
  )
}

export const MultipleSelectCellEditor = forwardRef(MultipleSelectCellEditorImpl)
