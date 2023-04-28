import { ActionIcon, Breadcrumbs, Flex, Group, Text } from '@appser/ui'

import { AppLogo } from './AppLogo'
import { IconTable } from '../icons/IconTable'
import { IconView } from '../icons/IconView'

import type { FC } from 'react'
import type { TApp } from 'web/servers/app/types'
import type { TDataset, TView } from 'web/servers/dataset/types'

interface Props {
  current: {
    app: TApp
    dataset?: Pick<TDataset, 'id' | 'name'>
    view?: Pick<TView, 'id' | 'name' | 'type'>
  }
}

export const AppBreadcrumbs: FC<Props> = ({ current: { app, dataset, view } }) => {
  const nodes = Array(3).fill('App').map((item, index) => {
    return (
      <Group key={index} spacing="xs" align="center">
        <AppLogo icon={app.icon} tintColor={app.tintColor} size={24} />
        <Text>{item}</Text>
      </Group>
    )
  })

  return (
    <Flex gap="sm" align="center">
      <Breadcrumbs separator="›">
        {dataset && (
          <ActionIcon
            w="auto"
            sx={{
              padding: '3px 7px'
            }}
            h='auto'
          >
            <Group spacing="xs" align="center">
              <IconTable size={20} />
              <Text>{dataset.name}</Text>
            </Group>
          </ActionIcon>

        )}
        {view && (
          <Group spacing="xs" align="center">
            <IconView size={20} type={view.type} />
            <Text>{view.name}</Text>
          </Group>
        )}

      </Breadcrumbs>
    </Flex>
  )
}
