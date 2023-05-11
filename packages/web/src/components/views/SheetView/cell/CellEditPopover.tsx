import { Flex } from '@appser/ui'
import { useClickOutside } from '@appser/ui/hooks'
import { useRef, useState } from 'react'
import { useUpdateRecord } from 'web/hooks/dataset/useUpdateRecord'
import { useActivatedDataset } from 'web/hooks/useActivatedDataset'
import { useActivatedView } from 'web/hooks/useActivatedView'

import { useFieldsConfig } from '../fields'
import { useActivatedCell } from '../hooks/useActivatedCell'

import type { Cell } from './Cell'
import type { FieldCellEditorRef } from '../fields'
import type { FC } from 'react'

interface Props {
  onClose?: () => void
  onChange?: (cell: Cell) => void
}

export const CellEditPopover: FC<Props> = () => {
  const fields = useFieldsConfig()
  const [dataset] = useActivatedDataset()
  const [view] = useActivatedView()
  const [activatedCell, setActivatedCell] = useActivatedCell()
  const updateRecord = useUpdateRecord(dataset?.id ?? '0', view?.id ?? '0')
  const CellEditor = activatedCell?.field ? fields[activatedCell.field.type].CellEditor : undefined
  const showEditor = activatedCell && CellEditor
  const editorRef = useRef<FieldCellEditorRef>(null)
  const [ref, setRef] = useState<HTMLDivElement | null>(null)

  const save = (data: unknown) => {
    if (!activatedCell) return
    setActivatedCell(null)

    if (data === activatedCell.row.record[activatedCell.field.name]) return

    const row = activatedCell.row
    row.record = {
      id: row.record.id,
      [activatedCell.field.name]: data
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
        field={activatedCell.field}
        rectangle={activatedCell.bounds}
        onDone={save}
      />
    </Flex>
  )
}
