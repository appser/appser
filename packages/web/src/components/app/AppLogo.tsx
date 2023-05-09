import { ThemeIcon } from '@appser/ui'

import { IconApp } from '../icons/IconApp'

import type { FC } from 'react'

interface Props {
  icon: string
  tintColor: string
  size?: number
}

export const AppLogo: FC<Props> = ({ size = 28, icon, tintColor }) => {
  return (
    <ThemeIcon
      radius="xs"
      size={size}
      // mb='xs'
      color={tintColor}
    >
      <IconApp id={icon} size={size / 3 * 2} />
    </ThemeIcon>
  )
}
