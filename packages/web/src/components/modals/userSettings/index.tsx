import { Flex, Tabs, Text, colors, createStyles } from '@appser/ui'
import { openContextModal } from '@appser/ui/modals'
import { IconMonitor } from 'web/components/icons/IconMonitor'
import { IconShield } from 'web/components/icons/IconShield'
import { IconUser } from 'web/components/icons/IconUser'
import { useGetAccount } from 'web/hooks/account/useGetAccount'

import { UserSettingsAccount } from './UserSettingsAccount'
import { UserSettingsAppearance } from './UserSettingsAppearance'
import { UserSettingsProfile } from './UserSettingsProfile'

import type { ContextModalProps } from '@appser/ui/modals'

export const useStyles = createStyles((theme) => ({
  root: {
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0
  },
  tabsRoot: {
    height: 520,
    overflow: 'hidden',
    borderRadius: theme.radius.md
  },
  tabsList: {
    paddingTop: 15,
    paddingBottom: 30,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: theme.colorScheme === 'light' ? theme.colors.gray[0] : theme.colors.dark[6],
    borderRight: `1px solid ${colors[theme.colorScheme].border}`
  },
  tabsTab: {
    minWidth: 180
  },
  tabsPanel: {
    display: 'flex',
    flexDirection: 'column'
  },
  tabListTitle: {
    color: 'gray',
    fontWeight: 600,
    padding: '3px 10px',
    fontSize: theme.fontSizes.xs
  }
}))

export function UserSettingsModal({ context, id }: ContextModalProps) {
  const { data: user } = useGetAccount()
  const { classes } = useStyles()

  return (
    <Flex className={classes.root} direction="column" gap="md">
      <Tabs variant='pills'
        classNames={{ root: classes.tabsRoot, tabsList: classes.tabsList, tab: classes.tabsTab, panel: classes.tabsPanel }}
        orientation="vertical"
        defaultValue="profile"
      >
        <Tabs.List>
          <Text className={classes.tabListTitle}>{user?.name}</Text>
          <Tabs.Tab value="profile" icon={<IconUser size={16} />}>Profile</Tabs.Tab>
          <Tabs.Tab value="account" icon={<IconShield size={16} />}>Account</Tabs.Tab>
          <Tabs.Tab value="appearance" icon={<IconMonitor size={16} />}>Appearance</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="profile">
          <UserSettingsProfile />
        </Tabs.Panel>

        <Tabs.Panel value="account">
          <UserSettingsAccount />
        </Tabs.Panel>

        <Tabs.Panel value="appearance">
          <UserSettingsAppearance />
        </Tabs.Panel>
      </Tabs>
    </Flex>
  )
}

export const openUserSettings = () => openContextModal({
  modal: 'UserSettingsModal',
  withCloseButton: false,
  innerProps: {},
  size: 715,
  padding: 0
})
