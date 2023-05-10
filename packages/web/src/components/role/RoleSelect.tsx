import { Menu, Radio } from '@appser/ui'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { MenuButton } from '../common/MenuButton'

import type { FC } from 'react'
import type { Role } from 'web/types'

interface RoleSelectProps {
  roles: Role[]
  defaultRoleId?: string
  onChange?: (role: Role) => void
}

export const RoleSelect: FC<RoleSelectProps> = ({ roles, defaultRoleId, onChange }) => {
  const { t } = useTranslation()
  const [role, setRole] = useState<Role | null>(null)
  const [isFocus, setIsFocus] = useState(false)

  useEffect(() => {
    role && onChange?.(role)
  }, [role])

  return (
    <Menu
      width={300}
      withinPortal
      position="bottom-end"
      shadow="md"
      offset={13}
      onChange={s => setIsFocus(s)}
    >
      <Menu.Target>
        <MenuButton placeholder={String(t('component.RoleSelect.chooseRole'))}>{role?.name}</MenuButton>
      </Menu.Target>
      <Menu.Dropdown p={8}>
        <Menu.Label>{t('component.RoleSelect.role')}</Menu.Label>
        {roles.reverse().map((role) => (
          <Menu.Item
            key={role.id}
            onClick={() => setRole(role)}
          >
            <Radio
              size='sm'
              defaultChecked={role.id === defaultRoleId}
              label={role.name}
              description={role.description}
            />
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  )
}
