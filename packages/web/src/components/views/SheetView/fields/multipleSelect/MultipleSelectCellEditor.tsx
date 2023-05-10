import { MultiSelect } from '@appser/ui'
import { forwardRef, useImperativeHandle, useMemo, useState } from 'react'

import type { FieldCellEditorProps, FieldCellEditorRef } from '..'
import type { BubbleCell } from '@glideapps/glide-data-grid'
import type { ForwardRefRenderFunction } from 'react'

const MultipleSelectCellEditorImpl: ForwardRefRenderFunction<FieldCellEditorRef, FieldCellEditorProps<BubbleCell> > = (
  { cell, field, rectangle, onDone },
  forwardedRef
) => {
  const [data, setData] = useState(cell.data)
  const list = useMemo(() => {
    if (field.type !== 'multipleSelect') return []

    return field.options?.items.map((item) => ({
      label: item.name,
      value: String(item.id)
    }))
  }, [field.options, field.type])

  const save = () => {
    onDone(data)
  }

  useImperativeHandle(forwardedRef, () => ({
    save
  }))

  return (
    <MultiSelect
      data={list}
      defaultValue={cell.data}
      initiallyOpened
      clearable
      variant='unstyled'
      onChange={v => setData(v)}
    />
  )
}

export const MultipleSelectCellEditor = forwardRef(MultipleSelectCellEditorImpl)
