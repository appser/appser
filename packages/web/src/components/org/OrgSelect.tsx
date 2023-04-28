import { Flex, Group, Menu, Text, UnstyledButton } from '@appser/ui'
import { useNavigate } from 'react-router-dom'
import { IconSelector } from 'web/components/icons/IconSelector'
import { OrgLogo } from 'web/components/org/OrgLogo'
import { useActivatedOrg } from 'web/hooks/useActivatedOrg'
import { useListAccountOrg } from 'web/servers/account/useListAccountOrg'

import type { FC } from 'react'
import type { TOrg } from 'web/servers/org/types'

export const OrgSelect: FC = () => {
  const navigate = useNavigate()
  const [activatedOrg, setActivatedOrg] = useActivatedOrg()
  const { data: orgs, isSuccess } = useListAccountOrg()

  if (!isSuccess) return null

  const gotoOrg = (org: TOrg) => {
    navigate(`/orgs/${org.id}/apps`)
    setActivatedOrg(org)
  }

  return (
    <Menu width={210}>
      <Menu.Target>
        <UnstyledButton
          component={Flex}
          justify="space-between"
          align="center"
          h="100%"
          w='100%'
          px="md"
          sx={({ radius, colorScheme, colors }) => ({
            flex: 1,
            '&:hover': {
              borderRadius: radius.sm,
              backgroundColor: colorScheme === 'dark' ? colors.dark[5] : colors.gray[1]
            }
          })}
        >
          <Group spacing="sm" w='100%'>
            <OrgLogo org={activatedOrg} />
            <Text fw="bold" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}>{activatedOrg.name}</Text>
          </Group>
          <IconSelector size={16} />
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown>
        {orgs.map((org) => (
          <Menu.Item key={org.id} onClick={() => gotoOrg(org)}>
            <Group spacing="sm" w='100%'>
              <OrgLogo org={org} />
              <Text fw="bold" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}>{org.name}</Text>
            </Group>
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  )
}
