import { Box, Button, Center, CloseButton, Flex, Group, Popover } from '@mantine/core'
import { useForm } from '@mantine/form'
import { IconGripVertical } from '@tabler/icons'
import { useMemo } from 'react'
import { DragDropContext, Draggable } from 'react-beautiful-dnd'
import { MenuButton } from 'web/components/common/MenuButton'
import { StrictModeDroppable } from 'web/components/common/StrictModeDroppable'
import { useRecordsSorts } from 'web/servers/dataset/useQueryRecord'

import { ColumnSelect } from '../column/ColumnSelect'
import { ColumnSort } from '../column/ColumnSort'
import { useColumns } from '../hooks/useColumns'

import type { FC } from 'react'

export const RecordSortButton: FC = () => {
  const { visibleColumns } = useColumns()
  const [sorts, setSorts] = useRecordsSorts()

  const form = useForm({
    initialValues: {
      sorts: sorts.map<[string, 'asc' | 'desc']>(s => s.startsWith('-') ? [s.slice(1), 'desc'] : [s, 'asc'])
    }
  })

  const unSelectedColumns = useMemo(() => {
    const exist = form.values.sorts.map(s => s[0])

    return visibleColumns.filter(c => !exist.includes(c.name))
  }, [form.values])

  const submit = () => {
    const recordsSorts = form.values.sorts.map(([name, direction]) => `${direction === 'desc' ? '-' : ''}${name}`)
    setSorts(recordsSorts)

    console.log(form.values.sorts)
  }

  const items = form.values.sorts.map((sort, index) => {
    const fieldName = sort[0]
    const columns = visibleColumns.filter(c => c.name === fieldName || unSelectedColumns.some(c2 => c2.name === c.name))

    return (
      <Draggable key={fieldName} index={index} draggableId={fieldName}>
        {(provided) => (
          <Group spacing="xs" ref={provided.innerRef} mt="xs" {...provided.draggableProps}>
            <Center {...provided.dragHandleProps}>
              <IconGripVertical size={18} />
            </Center>
            <ColumnSort
              columns={columns}
              sort={sort}
              onChange={(s) => form.setFieldValue(`sorts.${index}`, s)}
            />
            <CloseButton onClick={() => form.removeListItem('sorts', index)} />
          </Group>
        )}
      </Draggable>
    )
  })

  return (
    <Popover
      shadow="md"
      position='bottom-start'
      transitionProps={{
        duration: 0
      }}
    >
      <Popover.Target>
        <MenuButton>Sort</MenuButton>
      </Popover.Target>

      <Popover.Dropdown>
        <Flex direction="column">
          <Box>
            <DragDropContext
              onDragEnd={({ destination, source }) =>
                form.reorderListItem('sorts', { from: source.index, to: destination?.index ?? 0 })}
            >
              <StrictModeDroppable droppableId="dnd-list2" direction="vertical">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {items}
                    {provided.placeholder}
                  </div>
                )}
              </StrictModeDroppable>
            </DragDropContext>
          </Box>
          <Group mt="md">
            <ColumnSelect columns={unSelectedColumns} onChange={c => form.insertListItem('sorts', [c.name, 'asc'])} />
            <Button variant='subtle' onClick={submit}>submit</Button>
          </Group>
        </Flex>
      </Popover.Dropdown>
    </Popover>
  )
}
