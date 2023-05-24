import { ActionIcon, Badge, Box, Button, Flex, Group, Menu, Popover, Table, Text, Title, createStyles } from '@appser/ui'
import { IconUserPlus } from '@tabler/icons'
import { useCallback, useState } from 'react'
import { MoreHorizontal } from 'react-feather'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { NavHeader } from 'web/components/common/NavHeader'
import { openAlertDialog } from 'web/components/modals/alertDialog'
import { openInviteOrgPeople } from 'web/components/modals/inviteOrgPeople'
import { RoleChange } from 'web/components/role/RoleChange'
import { UserAvatar } from 'web/components/user/UserAvatar'
import { listOrgPeopleQuery, useListOrgPeople } from 'web/hooks/org/useListOrgPeople'
import { useRemoveOrgPerson } from 'web/hooks/org/useRemoveOrgPerson'
import useAccess from 'web/hooks/ui/useAccess'
import { useActivateOrg } from 'web/hooks/ui/useActivateOrg'

import type { QueryClient } from '@tanstack/react-query'
import type { LoaderFunctionArgs } from 'react-router-dom'

export const loader = (queryClient: QueryClient) => async ({ request, params }: LoaderFunctionArgs) => {
  const { orgId = '' } = params

  queryClient.prefetchQuery(listOrgPeopleQuery({ orgId, kind: 'member' }))

  return null
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

export default function OrgIdMembers() {
  const { t } = useTranslation()
  const { can } = useAccess()
  const { classes } = useStyles()
  const { orgId = '' } = useParams<{ orgId: string }>()
  const [currentOrg] = useActivateOrg()
  const { data: people } = useListOrgPeople({ orgId, kind: 'member' })
  const removePerson = useRemoveOrgPerson()
  const [activatedUserId, setActivatedUserId] = useState('')
  const { deny: denyCreateInvitation } = can('org:invitation:create', { orgId })

  const badgeColor = useCallback((roleId: string) => {
    if (roleId === '2000') return undefined

    return 'gray'
  }, [])

  const confirmRemovePerson = useCallback((userId: string) => {
    const person = people?.find(({ user }) => user.id === userId)

    if (!person) return

    openAlertDialog({
      title: t('modal.removeOrgPerson.title', { name: person.user.name, org: currentOrg?.name }),
      buttons: [
        {
          type: 'cancel',
          label: t('modal.button.cancel')
        },
        {
          label: t('modal.removeOrgPerson.remove'),
          type: 'destructive',
          onClick: (close) => {
            removePerson.mutate({ orgId, userId })
            close()
          }
        }
      ]
    })
  }, [people, currentOrg])

  return (
    <Flex direction="column" sx={{ flex: 1 }}>
      <NavHeader px='lg'>
        <Flex w={640} justify="space-between" align="center">
          <Title order={5} px='sm'>{t('page.home.orgs.-.people.members')}</Title>
          <Button
            hidden={denyCreateInvitation}
            size="xs"
            variant='default'
            leftIcon={<IconUserPlus size={14} stroke={2.5} />}
            onClick={openInviteOrgPeople}
          >
            {t('page.home.orgs.-.people.invite')}
          </Button>
        </Flex>
      </NavHeader>
      <Box p="lg">
        <Flex direction="column">
          <Table
            striped
            border={0}
            highlightOnHover
            sx={theme => ({ maxWidth: 640, overflow: 'hidden' })}
          >
            <tbody>
              {people?.map(({ user, role }) => (
                <tr key={user.id} className={classes.tr}>
                  <td width={300}>
                    <Group>
                      <UserAvatar user={user} size="md" />
                      <Text fw="bold">{user.name}</Text>
                    </Group>
                  </td>
                  <td>
                    <Popover
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
                    <Menu position='bottom-end'>
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
        </Flex>
      </Box>
    </Flex>
  )
}
