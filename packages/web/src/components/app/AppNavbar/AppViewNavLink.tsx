import { ActionIcon, Button, ContextMenu, Flex, Group } from '@appser/ui'
import { IconDots } from '@tabler/icons'
import { useState } from 'react'
import EditableText from 'web/components/common/EditableText'
import { IconView } from 'web/components/icons/IconView'

import { AppNavLink } from './AppNavLink'

import type { FC, PropsWithChildren } from 'react'
import type { View } from 'web/types'

interface Props extends PropsWithChildren {
  view: Pick<View, 'name' | 'type'>
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
            <Flex align='center' justify='space-between' w='100%'>
              <EditableText
                onCancel={() => setIsEdit(false)}
                isEditable={isEdit}
                onConfirm={v => {
                  setIsEdit(false)
                }}
              >
                {view.name || 'Untitled View'}
              </EditableText>
              {!isEdit && (
                <ContextMenu.TargetButton>
                  <ActionIcon
                    className='targetButton'
                    variant='subtle'
                    color='dark'
                    sx={theme => ({
                      '&:hover': {
                        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[3]
                      }
                    })}
                  >
                    <IconDots size={15} />
                  </ActionIcon>
                </ContextMenu.TargetButton>
              )}

            </Flex>

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
