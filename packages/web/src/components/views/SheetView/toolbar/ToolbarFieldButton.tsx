import { ActionIcon, Button, Center, Divider, Flex, Group, Menu, Popover, Text } from '@appser/ui'
import { openConfirmModal } from '@appser/ui/modals'
import { useState } from 'react'
import { DragDropContext, Draggable } from 'react-beautiful-dnd'
import { MenuButton } from 'web/components/common/MenuButton'
import { StrictModeDroppable } from 'web/components/common/StrictModeDroppable'
import { IconEye } from 'web/components/icons/IconEye'
import { IconEyeOff } from 'web/components/icons/IconEyeOff'
import { IconGripVertical } from 'web/components/icons/IconGripVertical'
import { IconMoreVertical } from 'web/components/icons/IconMoreVertical'
import { useAddField } from 'web/hooks/dataset/useAddField'
import { useDeleteField } from 'web/hooks/dataset/useDeleteField'
import { useUpdateView } from 'web/hooks/dataset/useUpdateView'

import { FieldConfigForm } from '../field/FieldConfigForm'
import { FieldTypeIcon } from '../field/FieldTypeIcon'
import { useFields } from '../hooks/useFields'

import type { Field } from '../field/Field'
import type { FC } from 'react'
import type { DatasetField } from 'web/types'

export const ToolbarFieldButton: FC = () => {
  const { fields } = useFields()
  const [isEditing, setIsEditing] = useState(false)
  const updateView = useUpdateView()
  const addField = useAddField()
  const deleteField = useDeleteField()

  const freshField: DatasetField = {
    title: '',
    name: '',
    type: 'simpleText'
  }

  const toggleField = (field: Field) => {
    updateView.mutate({
      field: {
        [field.name]: {
          selected: !field.selected
        }
      }
    })
  }

  const sortFields = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return
    fields.splice(toIndex, 0, fields.splice(fromIndex, 1)[0])

    updateView.mutate({
      fields: fields.map(c => c.name)
    })
  }

  const confirmDeleteField = (field: Field) => {
    openConfirmModal({
      title: 'Delete Field',
      zIndex: 9000,
      children: 'Are you sure you want to delete this field?',
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { loading: deleteField.isLoading },
      onConfirm: () => deleteField.mutate({ fieldName: field.name })
    })
  }

  const items = fields.map((field, index) => {
    return (
      <Draggable key={index} index={index} draggableId={index.toString()}>
        {(provided) => (
          <Flex justify="space-between" ref={provided.innerRef} mt="xs" {...provided.draggableProps}>
            <Group spacing={0}>
              <Center mr={5} {...provided.dragHandleProps}>
                <IconGripVertical size={18} />
              </Center>
              <FieldTypeIcon type={field.type} />
              <Text fz="sm">{field.title}</Text>
            </Group>
            <Group spacing={0}>
              <ActionIcon onClick={() => toggleField(field)}>
                {field.selected ? <IconEye size={16} /> : <IconEyeOff size={16} />}
              </ActionIcon>

              {!field.locked && (
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
                        <FieldConfigForm
                          defaultField={field}
                          onSubmit={() => {}}
                          onCancel={() => setIsEditing(false)}
                        />
                        )
                      : (
                        <>
                          <Menu.Item closeMenuOnClick={false} onClick={() => setIsEditing(true)}>Edit</Menu.Item>
                          <Menu.Item
                            onClick={() => confirmDeleteField(field)}
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
        <MenuButton>Fields</MenuButton>
      </Popover.Target>

      <Popover.Dropdown>
        <Text size="xs" color="dimmed" fw={500}>Field Settings</Text>
        <DragDropContext
          onDragEnd={({ destination, source }) => sortFields(source.index, destination?.index ?? 0)}
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
            <Button fullWidth variant='light'>Add field</Button>
          </Popover.Target>
          <Popover.Dropdown p={0}>
            <FieldConfigForm
              defaultField={freshField}
              loading={addField.isLoading}
              onSubmit={(field) => addField.mutate(field)}
              onCancel={() => setIsEditing(false)}
            />
          </Popover.Dropdown>
        </Popover>
      </Popover.Dropdown>
    </Popover>
  )
}
