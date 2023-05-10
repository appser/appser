import { CompactSelection } from '@glideapps/glide-data-grid'
import { atom, useAtom } from 'jotai'
import { useCallback } from 'react'

import type { DataEditorProps, GridSelection } from '@glideapps/glide-data-grid'

const gridSelection = atom({
  rows: CompactSelection.empty(),
  columns: CompactSelection.empty()
})

export function useGridSelection() {
  const [selection, setSelection] = useAtom(gridSelection)
  const handler: Partial<DataEditorProps> = {
    gridSelection: selection,
    onGridSelectionChange: useCallback((newSel: GridSelection) => {
      let newRows = CompactSelection.empty()

      if (newSel.current !== undefined) {
        newRows = newRows.add([newSel.current.range.y, newSel.current.range.y + newSel.current.range.height])
      }

      for (const b of newSel.current?.rangeStack ?? []) {
        newRows = newRows.add([b.y, b.y + b.height])
      }

      setSelection({
        ...newSel,
        rows: newRows
      })
    }, [selection])
  }

  return {
    selection,
    handler,
    setSelection
  }
}
