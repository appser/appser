import { Select } from '@appser/ui'
import { forwardRef, useImperativeHandle, useMemo, useState } from 'react'

import type { FieldCellEditorProps, FieldCellEditorRef } from '..'
import type { BubbleCell } from '@glideapps/glide-data-grid'
import type { ForwardRefRenderFunction } from 'react'

const SingleSelectCellEditorImpl: ForwardRefRenderFunction<FieldCellEditorRef, FieldCellEditorProps<BubbleCell> > = (
  { cell: { field }, defaultValue, onDone },
  forwardedRef
) => {
  const [value, setValue] = useState<string | null>(defaultValue ? String(defaultValue) : null)
  const data = useMemo(() => {
    if (field.type === 'singleSelect') {
      return field.options?.items.map((item) => ({
        label: item.name,
        value: String(item.id)
      }))
    }

    return []
  }, [field.options, field.type])

  const save = () => {
    onDone(value)
  }

  useImperativeHandle(forwardedRef, () => ({
    save
  }))

  return (
    <Select
      data={data}
      defaultValue={value}
      initiallyOpened
      clearable
      variant='unstyled'
      onChange={v => {
        setValue(v)
      }}
    />
  )
}

export const SingleSelectCellEditor = forwardRef(SingleSelectCellEditorImpl)
