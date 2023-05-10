import { Box, Flex, Group, Menu, Text, UnstyledButton } from '@appser/ui'
import { useTranslation } from 'react-i18next'
import { IconLogOut } from 'web/components/icons/IconLogout'
import { IconMoreVertical } from 'web/components/icons/IconMoreVertical'
import { IconUser } from 'web/components/icons/IconUser'
import { openAlertDialog } from 'web/components/modals/alertDialog'
import { openUserSettings } from 'web/components/modals/userSettings'
import { UserAvatar } from 'web/components/user/UserAvatar'
import { useGetAccount } from 'web/hooks/account/useGetAccount'
import { useSignOut } from 'web/hooks/signup/useSignOut'

export const OrgSidebarAccountSection = () => {
  const { t } = useTranslation()
  const { data: user, isSuccess } = useGetAccount()
  const signOut = useSignOut()

  if (!isSuccess) return null

  const confirmSignOut = () => {
    openAlertDialog({
      title: t('modal.confirmSignOut.title'),
      buttons: [
        {
          type: 'cancel',
          label: t('modal.button.cancel')
        },
        {
          label: t('modal.confirmSignOut.signOut'),
          onClick: (close) => {
            signOut.mutate()
            close()
          }
        }
      ]
    })
  }

  return (
    <Box
      h={50}
      sx={({ colorScheme, colors }) => ({
        borderTop: `1px solid ${colorScheme === 'light' ? colors.gray[2] : colors.dark[5]}`

      })}
    >
      <Menu width={220}>
        <Menu.Target>
          <UnstyledButton
            component={Flex}
            justify="space-between"
            align="center"
            h="100%"
            px="md"
            sx={({ radius, colorScheme, colors }) => ({
              '&:hover': {
                borderRadius: radius.sm,
                backgroundColor: colorScheme === 'dark' ? colors.dark[5] : colors.gray[1]
              }
            })}
          >
            <Group spacing="sm">
              <UserAvatar user={user} />
              <Text fw="bold">{user.name}</Text>
            </Group>
            <IconMoreVertical size={16} />
          </UnstyledButton>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Label>{user.name}</Menu.Label>
          <Menu.Divider />
          <Menu.Item icon={<IconUser size={16} />} onClick={openUserSettings}>
            {t('page.home.userSettings')}
          </Menu.Item>
          <Menu.Item icon={<IconLogOut size={16} />} onClick={confirmSignOut}>
            {t('page.home.signOut')}
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Box>

  )
}
