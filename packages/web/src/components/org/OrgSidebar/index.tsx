import { NavLink, Navbar, Text } from '@appser/ui'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import { NavHeader } from 'web/components/common/NavHeader'
import { Sidebar } from 'web/components/common/Sidebar'
import { IconCode } from 'web/components/icons/IconCode'
import { IconGrid } from 'web/components/icons/IconGrid'
import { IconSettings } from 'web/components/icons/IconSettings'
import { IconUsers } from 'web/components/icons/IconUsers'
import useAccess from 'web/hooks/useAccess'
import { useActivatedOrg } from 'web/hooks/useActivatedOrg'

import { OrgSidebarAccountSection } from './OrgSidebarAccountSection'
import { OrgSelect } from '../OrgSelect'

import type { FC } from 'react'

export const SIDEBAR_WIDTH = 230

export const OrgSidebar: FC = () => {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const [{ id: orgId = '' }] = useActivatedOrg()
  const { can } = useAccess()
  const { deny: denyUpdateOrg } = can('org:update', { orgId })
  const { deny: denyListPeople } = can('org:people:list', { orgId })

  const link = useMemo(() => ({
    apps: `/orgs/${orgId}/apps`,
    people: `/orgs/${orgId}/members`,
    settings: `/orgs/${orgId}/settings`
  }), [orgId])

  return (
    <Sidebar component={Navbar} w={SIDEBAR_WIDTH} zIndex={1}>
      <Navbar.Section>
        <NavHeader>
          <OrgSelect />
        </NavHeader>
      </Navbar.Section>
      <Navbar.Section p='sm' grow>
        <NavLink
          to={link.apps}
          component={RouterLink}
          active={pathname === link.apps}
          label={t('page.home.apps')}
          icon={<IconGrid size={16} />}
        />
        <NavLink
          to={link.people}
          component={RouterLink}
          label={t('page.home.members')}
          active={pathname === link.people}
          hidden={denyListPeople}
          icon={<IconUsers size={16} />}
        />
        <NavLink
          to={link.settings}
          active={pathname === link.settings}
          hidden={denyUpdateOrg}
          component={RouterLink}
          label={t('page.home.settings')}
          icon={<IconSettings size={16} />}
        />
      </Navbar.Section>
      <Navbar.Section>
        <OrgSidebarAccountSection />
      </Navbar.Section>
    </Sidebar>
  )
}
