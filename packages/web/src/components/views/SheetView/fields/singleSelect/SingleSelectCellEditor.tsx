import { Select } from '@appser/ui'
import { forwardRef, useImperativeHandle, useState } from 'react'

import type { FieldCellEditorProps, FieldCellEditorRef } from '..'
import type { BubbleCell } from '@glideapps/glide-data-grid'
import type { ForwardRefRenderFunction } from 'react'

const SingleSelectCellEditorImpl: ForwardRefRenderFunction<FieldCellEditorRef, FieldCellEditorProps<BubbleCell> > = (
  { cell, field, rectangle, onDone },
  forwardedRef
) => {
  const [data, setData] = useState<number | undefined>()

  const save = () => {
    onDone(data)
  }

  useImperativeHandle(forwardedRef, () => ({
    save
  }))

  return (
    <Select
      data={['React', 'Angular', 'Svelte', 'Vue', 'Riot', 'Next.js', 'Blitz.js']}
      placeholder="Pick all that you like"
      defaultValue="react"
      initiallyOpened
      clearable
      variant='unstyled'
    />
  )
}

export const SingleSelectCellEditor = forwardRef(SingleSelectCellEditorImpl)
