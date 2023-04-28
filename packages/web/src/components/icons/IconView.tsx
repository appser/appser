import { Table as IconTable } from 'react-feather'

import type { FC } from 'react'
import type { IconProps } from 'react-feather'
import type { TView } from 'web/servers/dataset/types'

interface Props extends IconProps {
  type: TView['type']
}

export const IconView: FC<Props> = ({ type, ...rest }) => {
  if (type === 'sheet') return <IconTable {...rest} />

  return null
}
