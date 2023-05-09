import { Navbar } from '@appser/ui'
import { IconPlus } from '@tabler/icons'
import { useCallback } from 'react'
import { DragDropContext, Draggable } from 'react-beautiful-dnd'
import { ActionButton } from 'web/components/common/ActionButton'
import { StrictModeDroppable } from 'web/components/common/StrictModeDroppable'
import { useActivatedApp } from 'web/hooks/useActivatedApp'
import { useCreateDataset } from 'web/servers/app/useCreateDataset'

import { AppDatasetNavLink } from './AppDatasetNavLink'
import { AppViewNavLink } from './AppViewNavLink'

import type { NavbarProps } from '@appser/ui'
import type { FC } from 'react'
import type { DropResult } from 'react-beautiful-dnd'
import type { TView } from 'web/servers/dataset/types'
import type { TApp } from 'web/types'

const reorder = (list: any[], startIndex: number, endIndex: number): any[] => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

export const AppNavbar: FC<NavbarProps> = (p) => {
  const [app] = useActivatedApp()
  const createDataset = useCreateDataset()

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return

    if (result.type.split('-')[0] === 'dataset') {
      const datasets = reorder((app?.datasets ?? []), result.source.index, result.destination.index)
      console.log(datasets)

      return
    }

    if (result.type.split('-')[0] === 'view') {
      const currentDataset = app?.datasets.find(dataset => dataset.id === result.source.droppableId)
      const views = reorder((currentDataset?.views ?? []), result.source.index, result.destination.index)
      console.log(views)
    }
  }

  const renderList = useCallback((list: TApp['datasets'] | TApp['datasets'][number]['views'], id: string, type: 'view' | 'dataset' = 'dataset') => (
    <StrictModeDroppable droppableId={id} type={`${type}-${id}`} key={id}>
      {(provided) => (
        <div {...provided.droppableProps} ref={provided.innerRef}>
          {list.map((item, index) => {
            return (
              <Draggable draggableId={item.id} key={item.id} index={index}>
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                    {type === 'dataset'
                      ? (
                        <AppDatasetNavLink dataset={item}>
                          {renderList((item as TApp['datasets'][number]).views, item.id, 'view')}
                        </AppDatasetNavLink>
                        )
                      : <AppViewNavLink key={item.id} view={item as Pick<TView, 'name' | 'type'>} />}
                  </div>
                )}
              </Draggable>
            )
          })}
          {provided.placeholder}
        </div>
      )}
    </StrictModeDroppable>
  ), [])

  return (
    <Navbar withBorder={false} {...p}>
      <Navbar.Section pr={7}
        sx={{
          flex: '0 0 44px',
          height: 44,
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center'
        }}
      >
        <ActionButton loading={createDataset.isLoading} onClick={() => createDataset.mutate()}>
          <IconPlus size={18} />
        </ActionButton>
      </Navbar.Section>
      <Navbar.Section p="md" pt={0} grow sx={{ overflow: 'auto' }}>
        <DragDropContext
          onDragEnd={onDragEnd}
        >
          {renderList(app?.datasets ?? [], 'dnd-list-app')}
        </DragDropContext>
      </Navbar.Section>
    </Navbar>
  )
}
