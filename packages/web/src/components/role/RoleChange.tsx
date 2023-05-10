import { Radio, Stack } from '@appser/ui'
import { useChangeOrgPeopleRole } from 'web/hooks/org/useChangeOrgPeopleRole'
import { useListOrgRole } from 'web/hooks/org/useListOrgRole'
import { useActivatedOrg } from 'web/hooks/useActivatedOrg'

import type { FC } from 'react'

interface RoleChangeProps {
  userId: string
  roleId: string
  done: () => void
}

export const RoleChange: FC<RoleChangeProps> = ({ userId, roleId, done }) => {
  const [{ id: orgId = '' }] = useActivatedOrg()
  const { data: roles = [] } = useListOrgRole({ orgId })
  const changeOrgPersonRole = useChangeOrgPeopleRole()

  const onChange = (roleId: string) => {
    changeOrgPersonRole.mutate({
      orgId,
      userId,
      requestBody: {
        roleId
      }
    })

    done()
  }

  return (
    <Stack w={300}>
      <Radio.Group label="Change Role" name='changeRole' value={roleId} onChange={onChange}>
        {roles.map((role) => (
          <Radio
            size='sm'
            key={role.id}
            value={role.id}
            label={role.name}
            description={role.description}
          />
        ))}
      </Radio.Group>
    </Stack>
  )
}
