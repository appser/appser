import { MultiSelect } from '@appser/ui'
import { forwardRef, useImperativeHandle, useMemo, useState } from 'react'

import type { FieldCellEditorProps, FieldCellEditorRef } from '..'
import type { BubbleCell } from '@glideapps/glide-data-grid'
import type { ForwardRefRenderFunction } from 'react'

const MultipleSelectCellEditorImpl: ForwardRefRenderFunction<FieldCellEditorRef, FieldCellEditorProps<BubbleCell> > = (
  { cell, column, rectangle, onDone },
  forwardedRef
) => {
  const [data, setData] = useState(cell.data)
  const list = useMemo(() => {
    if (column.field !== 'multipleSelect') return []

    return column.options?.items.map((item) => ({
      label: item.name,
      value: String(item.id)
    }))
  }, [column.options, column.field])

  const save = () => {
    onDone(data)
  }

  useImperativeHandle(forwardedRef, () => ({
    save
  }))

  if (column.field !== 'multipleSelect') return null

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
