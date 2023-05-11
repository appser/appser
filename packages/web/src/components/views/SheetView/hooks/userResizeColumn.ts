import { useUpdateView } from 'web/hooks/dataset/useUpdateView'

import { useFields } from './useFields'

import type { DataEditorProps } from '@glideapps/glide-data-grid'

export function userResizeColumn() {
  const { instantUpdate } = useFields()
  const updateView = useUpdateView()

  // fix stuck when right element work with resize action
  const onColumnResizeStart: DataEditorProps['onColumnResizeStart'] = () => {
    const rightElementWrap = document.getElementsByClassName('dvn-scroll-inner')?.[0].children?.[1] as HTMLDivElement

    if (rightElementWrap) {
      rightElementWrap.style.pointerEvents = 'none'
    }
  }

  const onColumnResize: DataEditorProps['onColumnResize'] = (field, newSize) => {
    instantUpdate(fields => {
      const index = fields.findIndex(c => c.id === field.id)
      const newFields = [...fields]

      newFields.splice(index, 1, {
        ...fields[index],
        width: newSize
      })

      return newFields
    })
  }

  const onColumnResizeEnd: DataEditorProps['onColumnResizeEnd'] = (column, newSize) => {
    if (column.id) {
      updateView.mutate({
        field: {
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
