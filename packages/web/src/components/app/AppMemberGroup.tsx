import { Avatar, Button, Group } from '@appser/ui'
import { useAppPeople } from 'web/hooks/app/useAppPeople'

import { openAddAppMember } from '../modals/addAppMember'
import { openAppMember } from '../modals/appMember'
import { UserAvatar } from '../user/UserAvatar'

import type { FC } from 'react'
import type { App } from 'web/types'

interface Props {
  app: Required<Pick<App, 'id' | 'name' | 'orgId'>>
}

export const AppMemberGroup: FC<Props> = ({ app }) => {
  const { data: persons } = useAppPeople(app.id)

  return (
    <Group spacing={6}>
      <Avatar.Group spacing="sm" onClick={() => openAppMember({ app })}>
        {persons?.slice(0, 2).map(({ user }) => (
          <UserAvatar
            user={user}
            key={user.id}
            size={30}
          />
        ))}
        {persons && persons?.length > 2 && <Avatar size={30} radius="xl">+{persons.length - 2}</Avatar>}
      </Avatar.Group>
      <Button variant='default' size='xs' onClick={() => openAddAppMember({ app })}>Share</Button>
    </Group>
  )
}
