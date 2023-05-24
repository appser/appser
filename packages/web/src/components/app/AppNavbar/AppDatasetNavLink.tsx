import { ActionIcon, ContextMenu, Flex } from '@appser/ui'
import { IconDots, IconTable } from '@tabler/icons'
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

            <Flex align='center' justify='space-between' w='100%'>
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
