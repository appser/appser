import { ActionIcon, Badge, Group, Menu, Popover, Table, Text, createStyles, openContextModal } from '@appser/ui'
import { useCallback, useState } from 'react'
import { MoreHorizontal } from 'react-feather'
import { useTranslation } from 'react-i18next'
import { useAppPeople } from 'web/hooks/app/useAppPeople'
import i18n from 'web/vendor/i18n'

import { RoleChange } from '../role/RoleChange'
import { UserAvatar } from '../user/UserAvatar'

import type { ContextModalProps } from '@appser/ui'
import type { App } from 'web/types'

export type AppMemberProps = {
  app: Pick<App, 'id'>
}

const useStyles = createStyles((theme) => ({
  tr: {
    '& td': {
      borderTop: '0 none !important'
    },
    '& td: first-of-type': {
      borderTopLeftRadius: theme.radius.md,
      borderBottomLeftRadius: theme.radius.md
    },
    '& td: last-child': {
      borderTopRightRadius: theme.radius.md,
      borderBottomRightRadius: theme.radius.md
    }
  }
}))

export function AppMemberModal({ context, id, innerProps: { app: { id: appId } } }: ContextModalProps<AppMemberProps>) {
  const { t } = useTranslation()
  const { classes } = useStyles()
  const { data: datasetPersons = [] } = useAppPeople(appId)
  const [activatedUserId, setActivatedUserId] = useState('')
  const badgeColor = useCallback((roleId: string) => {
    if (roleId === '2000') return undefined

    return 'gray'
  }, [])

  return (
    <Table
      striped
      border={0}
      highlightOnHover
      sx={theme => ({ maxWidth: 640, overflow: 'hidden' })}
    >
      <tbody>
        {datasetPersons?.map(({ user, role }) => (
          <tr key={user.id} className={classes.tr}>
            <td width={300}>
              <Group>
                <UserAvatar user={user} size="md" />
                <Text fw="bold">{user.name}</Text>
              </Group>
            </td>
            <td>
              <Popover
                withinPortal
                opened={activatedUserId === user.id}
                withArrow
                onChange={() => setActivatedUserId('')}
              >
                <Popover.Target>
                  <Badge color={badgeColor(role.id)}>
                    {Number(role.id) < 10000 ? t(`config.role.${role.name}.name`) : role.name}
                  </Badge>
                </Popover.Target>
                <Popover.Dropdown>
                  <RoleChange userId={user.id} roleId={role.id} done={() => setActivatedUserId('')} />
                </Popover.Dropdown>
              </Popover>
            </td>
            <td width={40}>
              <Menu position='bottom-end' withinPortal>
                <Menu.Target>
                  <ActionIcon variant='default'><MoreHorizontal size={16} /></ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item onClick={() => setActivatedUserId(user.id)}>{t('page.home.orgs.-.people.changeRole')}</Menu.Item>
                  <Menu.Item onClick={() => confirmRemovePerson(user.id)}>{t('page.home.orgs.-.people.remove')}</Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}

export const openAppMember = ({ app }: AppMemberProps) => {
  const t = i18n.getFixedT(i18n.language)

  return openContextModal({
    modal: 'AppMemberModal',
    withCloseButton: true,
    title: 'Members',
    size: 560,
    transitionProps: {
      duration: 0
    },
    overlayProps: {
      color: 'rgba(0, 0, 0, 0.2)',
      opacity: 0.3
    },
    centered: false,
    trapFocus: false,
    innerProps: {
      app
    }
  })
}
