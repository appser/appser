import { Avatar, useColors } from '@appser/ui'

import type { AvatarProps } from '@appser/ui'
import type { FC } from 'react'

interface Props extends AvatarProps {
  org: {
    name: string
    image?: string
  }
}

export const OrgLogo: FC<Props> = ({ org: { name, image }, ...rest }) => {
  const colors = useColors()

  return (
    <Avatar
      src={image}
      size="sm"
      styles={({ colorScheme }, p) => ({
        placeholder: {
          backgroundColor: colors.border
          // borderRadius: p.size === 'lg' ? 12 : 4
        }
      })}
      {...rest}
    >
      {name.charAt(0).toUpperCase()}
    </Avatar>
  )
}
