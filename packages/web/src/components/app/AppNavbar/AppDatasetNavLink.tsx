import { ContextMenu } from '@appser/ui'
import { IconTable } from '@tabler/icons'
import { useState } from 'react'
import EditableText from 'web/components/common/EditableText'

import { AppNavLink } from './AppNavLink'

import type { FC, PropsWithChildren } from 'react'
import type { Dataset } from 'web/types'

interface Props extends PropsWithChildren {
  dataset: Pick<Dataset, 'name' | 'id'>
}

export const AppDatasetNavLink: FC<Props> = ({ children, dataset }) => {
  const [isEdit, setIsEdit] = useState(false)

  return (
    <ContextMenu>
      <ContextMenu.Target>
        <AppNavLink
          defaultOpened
          icon={<IconTable size={18} />}
          childrenOffset={0}
          label={
            <EditableText
              onCancel={() => setIsEdit(false)}
              isEditable={isEdit}
              onConfirm={v => {
                console.log(v)
                setIsEdit(false)
              }}
            >
              {dataset.name || 'Untitled Dataset'}
            </EditableText>
          }
        >
          {children}
        </AppNavLink>
      </ContextMenu.Target>
      <ContextMenu.Dropdown>
        <ContextMenu.Item onClick={() => setIsEdit(true)}>
          Rename
        </ContextMenu.Item>
        <ContextMenu.Divider />
        <ContextMenu.Item color="red">
          Delete
        </ContextMenu.Item>
      </ContextMenu.Dropdown>
    </ContextMenu>
  )
}
