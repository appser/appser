import { Select } from '@mantine/core'
import { forwardRef, useImperativeHandle, useState } from 'react'

import type { FieldCellEditorProps, FieldCellEditorRef } from '..'
import type { BubbleCell } from '@glideapps/glide-data-grid'
import type { ForwardRefRenderFunction } from 'react'

const SingleSelectCellEditorImpl: ForwardRefRenderFunction<FieldCellEditorRef, FieldCellEditorProps<BubbleCell> > = (
  { cell, column, rectangle, onDone: done },
  forwardedRef
) => {
  const [data, setData] = useState<number | undefined>()

  const save = () => {
    done(data)
  }

  useImperativeHandle(forwardedRef, () => ({
    done: save
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
