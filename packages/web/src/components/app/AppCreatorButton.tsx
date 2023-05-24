import { Group, Loader, Text, ThemeIcon, UnstyledButton, colors } from '@appser/ui'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { useCreateOrgApp } from 'web/hooks/org/useCreateOrgApp'
import useAccess from 'web/hooks/ui/useAccess'

import { IconPlusSquare } from '../icons/IconPlusSquare'

import type { FC } from 'react'

export const AppCreatorButton: FC = () => {
  const { t } = useTranslation()
  const { can } = useAccess()
  const { orgId = '' } = useParams<{ orgId: string }>()
  const { deny: denyCreateApp } = can('org:app:create', { orgId })
  const createApp = useCreateOrgApp()

  if (denyCreateApp) return null

  return (
    <UnstyledButton
      w={230}
      p="sm"
      sx={theme => ({
        border: `1px solid ${colors[theme.colorScheme].border}`,
        borderRadius: theme.radius.sm
      })}
      onClick={() => createApp.mutate()}
    >
      <Group color='appser'>
        <ThemeIcon variant='light' w={32} size="md" bg="transparent">
          {createApp.isLoading
            ? <Loader size="sm" />
            : <IconPlusSquare />}
        </ThemeIcon>
        <div>
          <Text size="sm" fw="bold">Create App</Text>
          <Text size="xs" color="dimmed">Manage your data</Text>
        </div>
      </Group>
    </UnstyledButton>
  )
}
