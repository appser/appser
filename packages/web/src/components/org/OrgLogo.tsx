import { Avatar } from '@appser/ui'

import type { AvatarProps } from '@appser/ui'
import type { FC } from 'react'

interface Props extends AvatarProps {
  org: {
    name: string
    image?: string
  }
}

export const OrgLogo: FC<Props> = ({ org: { name, image }, ...rest }) => {
  return (
    <Avatar
      src={image}
      size="sm"
      styles={({ colorScheme, colors }, p) => ({
        placeholder: {
          backgroundColor: colorScheme === 'dark' ? colors.dark[5] : colors.gray[2],
          borderRadius: p.size === 'lg' ? 12 : 4
        }
      })}
      {...rest}
    >
      {name.charAt(0).toUpperCase()}
    </Avatar>
  )
}
