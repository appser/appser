import { Flex } from '@appser/ui'
import { useClickOutside } from '@appser/ui'
import { useRef, useState } from 'react'
import { useActivatedDataset } from 'web/hooks/useActivatedDataset'
import { useActivatedView } from 'web/hooks/useActivatedView'
import { useUpdateRecord } from 'web/servers/dataset/useUpdateRecord'

import { useFields } from '../fields'
import { useActivatedCell } from '../hooks/useActivatedCell'

import type { Cell } from './Cell'
import type { FieldCellEditorRef } from '../fields'
import type { FC } from 'react'

interface Props {
  onClose?: () => void
  onChange?: (cell: Cell) => void
}

export const CellEditPopover: FC<Props> = () => {
  const fields = useFields()
  const [dataset] = useActivatedDataset()
  const [view] = useActivatedView()
  const [activatedCell, setActivatedCell] = useActivatedCell()
  const updateRecord = useUpdateRecord(dataset?.id ?? '0', view?.id ?? '0')
  const CellEditor = activatedCell?.column ? fields[activatedCell.column.field].CellEditor : undefined
  const showEditor = activatedCell && CellEditor
  const editorRef = useRef<FieldCellEditorRef>(null)
  const [ref, setRef] = useState<HTMLDivElement | null>(null)

  const save = (data: unknown) => {
    if (!activatedCell) return
    setActivatedCell(null)

    if (data === activatedCell.row.record[activatedCell.column.name]) return

    const row = activatedCell.row
    row.record = {
      id: row.record.id,
      [activatedCell.column.name]: data
    }

    updateRecord.mutate(row)
  }

  useClickOutside(() => {
    editorRef.current?.save?.()
  }, null, [ref])

  if (!showEditor) return null

  return (
    <Flex
      ref={setRef}
      sx={theme => ({
        top: activatedCell.bounds.y,
        left: activatedCell.bounds.x,
        width: activatedCell.bounds.width,
        minHeight: activatedCell.bounds.height,
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
        cell={activatedCell.cell as never}
        column={activatedCell.column}
        rectangle={activatedCell.bounds}
        onDone={save}
      />
    </Flex>
  )
}
