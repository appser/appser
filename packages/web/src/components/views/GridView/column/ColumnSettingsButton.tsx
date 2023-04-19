import { ActionIcon, Button, Center, Divider, Flex, Group, Menu, Popover, Text } from '@mantine/core'
import { openConfirmModal } from '@mantine/modals'
import { useState } from 'react'
import { DragDropContext, Draggable } from 'react-beautiful-dnd'
import { MenuButton } from 'web/components/common/MenuButton'
import { StrictModeDroppable } from 'web/components/common/StrictModeDroppable'
import { IconEye } from 'web/components/icons/IconEye'
import { IconEyeOff } from 'web/components/icons/IconEyeOff'
import { IconGripVertical } from 'web/components/icons/IconGripVertical'
import { IconMoreVertical } from 'web/components/icons/IconMoreVertical'
import { useAddColumn } from 'web/servers/dataset/useAddColumn'
import { useDeleteColumn } from 'web/servers/dataset/useDeleteColumn'
import { useUpdateView } from 'web/servers/dataset/useUpdateView'

import { ColumnConfigForm } from './ColumnConfigForm'
import { FieldIcon } from '../field/FieldIcon'
import { useColumns } from '../hooks/useColumns'

import type { DatasetColumn, Column } from './Column'
import type { FC } from 'react'

export const ColumnSettingsButton: FC = () => {
  const { columns } = useColumns()
  const [isEditing, setIsEditing] = useState(false)
  const updateView = useUpdateView()
  const addColumn = useAddColumn()
  const deleteColumn = useDeleteColumn()

  const freshColumn: DatasetColumn = {
    title: '',
    name: '',
    field: 'simpleText'
  }

  const toggleColumn = (column: Column) => {
    updateView.mutate({
      column: {
        [column.name]: {
          selected: !column.selected
        }
      }
    })
  }

  const sortColumns = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return
    columns.splice(toIndex, 0, columns.splice(fromIndex, 1)[0])

    const column = columns.reduce((acc, column, index) => {
      acc[column.name] = {
        pos: (index + 1) * 10
      }

      return acc
    }, {} as Record<string, { pos: number }>)

    updateView.mutate({
      column
    })
  }

  const deleteColumnConfirm = (column: Column) => {
    openConfirmModal({
      title: 'Delete Column',
      zIndex: 9000,
      children: 'Are you sure you want to delete this column?',
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { loading: deleteColumn.isLoading },
      onConfirm: () => deleteColumn.mutate({ columnName: column.name })
    })
  }

  const items = columns.map((column, index) => {
    return (
      <Draggable key={index} index={index} draggableId={index.toString()}>
        {(provided) => (
          <Flex justify="space-between" ref={provided.innerRef} mt="xs" {...provided.draggableProps}>
            <Group spacing={0}>
              <Center mr={5} {...provided.dragHandleProps}>
                <IconGripVertical size={18} />
              </Center>
              <FieldIcon type={column.field} />
              <Text fz="sm">{column.title}</Text>
            </Group>
            <Group spacing={0}>
              <ActionIcon onClick={() => toggleColumn(column)}>
                {column.selected ? <IconEye size={16} /> : <IconEyeOff size={16} />}
              </ActionIcon>

              {!column.isLocked && (
                <Menu
                  position='right-start'
                  offset={16}
                  onClose={() => setIsEditing(false)}
                >
                  <Menu.Target>
                    <ActionIcon>
                      <IconMoreVertical size={14} />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    {isEditing
                      ? (
                        <ColumnConfigForm
                          column={column}
                          onSubmit={() => {}}
                          onCancel={() => setIsEditing(false)}
                        />
                        )
                      : (
                        <>
                          <Menu.Item closeMenuOnClick={false} onClick={() => setIsEditing(true)}>Edit</Menu.Item>
                          <Menu.Item
                            onClick={() => deleteColumnConfirm(column)}
                          >
                            Delete
                          </Menu.Item>
                        </>
                        )}
                  </Menu.Dropdown>
                </Menu>
              )}
            </Group>
          </Flex>
        )}
      </Draggable>
    )
  })

  return (
    <Popover
      shadow="md"
      position='bottom-start'
      offset={4}
      width={300}
      transitionProps={{
        duration: 0
      }}
    >
      <Popover.Target>
        <MenuButton>Columns</MenuButton>
      </Popover.Target>

      <Popover.Dropdown>
        <Text size="xs" color="dimmed" fw={500}>Column Settings</Text>
        <DragDropContext
          onDragEnd={({ destination, source }) => sortColumns(source.index, destination?.index ?? 0)}
        >
          <StrictModeDroppable droppableId="dnd-list" direction="vertical">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {items}
                {provided.placeholder}
              </div>
            )}
          </StrictModeDroppable>
        </DragDropContext>
        <Divider my="md" />
        <Popover transitionProps={{ duration: 0 }} offset={15} shadow="md" position='right' width={200}>
          <Popover.Target>
            <Button fullWidth variant='light'>Add Column</Button>
          </Popover.Target>
          <Popover.Dropdown p={0}>
            <ColumnConfigForm
              column={freshColumn}
              loading={addColumn.isLoading}
              onSubmit={(column) => addColumn.mutate(column)}
              onCancel={() => setIsEditing(false)}
            />
          </Popover.Dropdown>
        </Popover>
      </Popover.Dropdown>
    </Popover>
  )
}
