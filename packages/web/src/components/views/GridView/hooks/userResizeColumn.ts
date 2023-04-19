import { useUpdateView } from 'web/servers/dataset/useUpdateView'

import { useColumns } from './useColumns'

import type { DataEditorProps } from '@glideapps/glide-data-grid'

export function userResizeColumn() {
  const { updateColumns: localUpdateColumns } = useColumns()
  const updateView = useUpdateView()

  // fix stuck when right element work with resize action
  const onColumnResizeStart: DataEditorProps['onColumnResizeStart'] = () => {
    const rightElementWrap = document.getElementsByClassName('dvn-scroll-inner')?.[0].children?.[1] as HTMLDivElement

    if (rightElementWrap) {
      rightElementWrap.style.pointerEvents = 'none'
    }
  }

  const onColumnResize: DataEditorProps['onColumnResize'] = (column, newSize) => {
    localUpdateColumns(columns => {
      const index = columns.findIndex(c => c.id === column.id)
      const newColumns = [...columns]

      newColumns.splice(index, 1, {
        ...columns[index],
        width: newSize
      })

      return newColumns
    })
  }

  const onColumnResizeEnd: DataEditorProps['onColumnResizeEnd'] = (column, newSize) => {
    if (column.id) {
      updateView.mutate({
        column: {
          [column.id]: {
            width: newSize
          }
        }
      })
    }

    // fix stuck when right element work with resize action
    const rightElementWrap = document.getElementsByClassName('dvn-scroll-inner')?.[0].children?.[1] as HTMLDivElement

    if (rightElementWrap) {
      rightElementWrap.style.pointerEvents = 'auto'
    }
  }

  return {
    handler: {
      maxColumnAutoWidth: 500,
      maxColumnWidth: 500,
      onColumnResizeStart,
      onColumnResize,
      onColumnResizeEnd
    }
  }
}
