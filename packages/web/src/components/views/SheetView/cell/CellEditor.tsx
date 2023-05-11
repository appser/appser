import { Flex } from '@appser/ui'
import { useClickOutside } from '@appser/ui/hooks'
import { useRef, useState } from 'react'
import { useUpdateRecord } from 'web/hooks/dataset/useUpdateRecord'

import { useFieldsConfig } from '../fields'
import { useEditingCell } from '../hooks/useEditingCell'

import type { Cell } from './Cell'
import type { FieldCellEditorRef } from '../fields'
import type { FC } from 'react'

interface Props {
  cell: Cell
  onClose?: () => void
}

export const CellEditor: FC<Props> = ({ cell }) => {
  const fields = useFieldsConfig()
  const updateRecord = useUpdateRecord()
  const [, setEditingCell] = useEditingCell()
  const [ref, setRef] = useState<HTMLDivElement | null>(null)
  const editorRef = useRef<FieldCellEditorRef>(null)
  const value = cell.row.record[cell.field.name]
  const CellEditor = cell.field ? fields[cell.field.type].CellEditor : undefined

  const onDone = (data: unknown) => {
    setEditingCell(null)

    if (!cell || data === value) return

    const row = cell.row

    updateRecord.mutate({
      id: row.record.id,
      fields: {
        [cell.field.name]: data
      },
      optimisticUpdateRow: row
    })
  }

  useClickOutside(() => {
    editorRef.current?.save()
  }, null, [ref])

  if (!CellEditor) return null

  return (
    <Flex
      ref={setRef}
      sx={theme => ({
        top: cell.bounds.y,
        left: cell.bounds.x,
        width: cell.bounds.width,
        minHeight: cell.bounds.height,
        position: 'fixed',
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : 'white',
        outline: `2px solid ${theme.fn.primaryColor(theme.colorScheme)}`,
        borderRadius: 2,
        zIndex: 3000,
        paddingLeft: 6
      })}
    >
      <CellEditor
        ref={editorRef}
        cell={cell as any}
        defaultValue={value}
        onDone={onDone}
      />
    </Flex>
  )
}
