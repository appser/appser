import { Avatar } from '@mantine/core'

import type { AvatarProps } from '@mantine/core'
import type { FC } from 'react'

interface Props extends AvatarProps {
  user: {
    name: string
    avatar?: string
  }
}

export const UserAvatar: FC<Props> = ({ user: { name, avatar }, ...rest }) => {
  return (
    <Avatar color="primary" src={avatar} radius={999} size={30} {...rest}>{name.slice(0, 2)}</Avatar>
  )
}
