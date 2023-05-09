import { Button, Center, CloseButton, Group, TextInput } from '@appser/ui'
import { useForm } from '@appser/ui'
import { useEffect } from 'react'
import { DragDropContext, Draggable } from 'react-beautiful-dnd'
import { FormSection } from 'web/components/common/FormSection'
import { StrictModeDroppable } from 'web/components/common/StrictModeDroppable'
import { IconGripVertical } from 'web/components/icons/IconGripVertical'
import { IconPlus } from 'web/components/icons/IconPlus'

import type { FieldOptionEditorProps } from '..'
import type { FC } from 'react'

export const SelectOptionEditor: FC<FieldOptionEditorProps> = ({ onChange, column }) => {
  const initialValues = column.field === 'singleSelect' || column.field === 'multipleSelect'
    ? column.options.items
    : [
        {
          name: ''
        }
      ]
  const form = useForm({
    initialValues: {
      items: initialValues
    }
  })
  const items = form.values.items.map((item, index) => (
    <Draggable key={index} index={index} draggableId={index.toString()}>
      {(provided) => (
        <Group spacing="xs" ref={provided.innerRef} mt="xs" {...provided.draggableProps}>
          <Center {...provided.dragHandleProps}>
            <IconGripVertical size={18} />
          </Center>
          <TextInput placeholder="" {...form.getInputProps(`items.${index}.name`)} />
          <CloseButton onClick={() => form.removeListItem('items', index)} />
        </Group>
      )}
    </Draggable>
  ))

  useEffect(() => {
    onChange?.(form.values)
  }, [form.values])

  return (
    <FormSection title="Options" mt="sm">
      <DragDropContext
        onDragEnd={({ destination, source }) =>
          form.reorderListItem('items', { from: source.index, to: destination?.index ?? 0 })}
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
      <FormSection.Divider mt="sm" />
      <Button
        fullWidth
        size='xs'
        leftIcon={<IconPlus size={14} />}
        variant='subtle'
        my="xs"
        onClick={() => form.insertListItem('items', { name: '' })}
      >
        Add an option
      </Button>
    </FormSection>
  )
}
