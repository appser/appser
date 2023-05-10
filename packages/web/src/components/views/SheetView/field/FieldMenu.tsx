import { Menu } from '@appser/ui'
import { useState } from 'react'
import { openAlertDialog } from 'web/components/modals/alertDialog'
import { useDeleteField } from 'web/hooks/dataset/useDeleteField'
import { useUpdateField } from 'web/hooks/dataset/useUpdateField'

import { FieldConfigForm } from './FieldConfigForm'

import type { MenuProps } from '@appser/ui'
import type { Rectangle } from '@glideapps/glide-data-grid'
import type { FC } from 'react'
import type { DatasetField } from 'web/types'

interface Props extends MenuProps {
  datasetId: string
  field: DatasetField
  bounds: Rectangle
}

export const FieldMenu: FC<Props> = ({ datasetId, bounds, field, onClose, ...rest }) => {
  const [showEditor, setShowEditor] = useState(false)
  const updateField = useUpdateField()
  const deleteField = useDeleteField()

  const confirmDeleteField = () => openAlertDialog({
    title: 'Are you sure you want to delete this field?',
    buttons: [
      {
        label: 'ok',
        onClick: () => deleteField.mutate({ fieldName: field.name })
      }
    ]
  })

  const onUpdate = (newField: DatasetField) => {
    const { title, type, options } = newField
    updateField.mutate(
      {
        datasetId,
        fieldName: field.name,
        requestBody: {
          title,
          type,
          options
        }
      },
      {
        onSuccess() {
          onClose?.()
        }
      }
    )
  }

  return (
    <Menu position='bottom-start' offset={3} onClose={onClose} {...rest}>
      <Menu.Target>
        <div
          style={{
            left: bounds.x,
            top: bounds.y,
            width: bounds.width,
            height: bounds.height,
            position: 'fixed',
            zIndex: -99,
            visibility: 'hidden',
            pointerEvents: 'none'
          }}
        />
      </Menu.Target>
      <Menu.Dropdown>
        {showEditor
          ? <FieldConfigForm
              defaultField={field}
              onSubmit={onUpdate}
              loading={updateField.isLoading}
              onCancel={() => setShowEditor(false)}
            />
          : (
            <>
              <Menu.Item
                closeMenuOnClick={false}
                onClick={() => setShowEditor(true)}
              >
                Edit field
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item
                onClick={confirmDeleteField}
              >
                Delete field
              </Menu.Item>
            </>
            )}
      </Menu.Dropdown>
    </Menu>
  )
}
