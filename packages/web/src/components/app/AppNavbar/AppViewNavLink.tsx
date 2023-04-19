import { ContextMenu } from '@appser/ui'
import { useState } from 'react'
import EditableText from 'web/components/common/EditableText'
import { IconView } from 'web/components/icons/IconView'

import { AppNavLink } from './AppNavLink'

import type { FC, PropsWithChildren } from 'react'
import type { TView } from 'web/servers/dataset/types'

interface Props extends PropsWithChildren {
  view: Pick<TView, 'name' | 'type'>
}

export const AppViewNavLink: FC<Props> = ({ children, view }) => {
  const [isEdit, setIsEdit] = useState(false)

  return (
    <ContextMenu>
      <ContextMenu.Target>
        <AppNavLink
          icon={<IconView type={view.type} size={16} />}
          styles={{
            root: {
              paddingLeft: 30
            }
          }}
          label={
            <EditableText
              onCancel={() => setIsEdit(false)}
              isEditable={isEdit}
              onConfirm={v => {
                setIsEdit(false)
              }}
            >
              {view.name || 'Untitled View'}
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
