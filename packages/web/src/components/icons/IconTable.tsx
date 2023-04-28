import { Table } from 'react-feather'
import { TView } from 'web/servers/dataset/types'

import type { FC } from 'react'
import type { Icon, IconProps } from 'react-feather'

interface Props extends IconProps {}

export const IconTable: FC<Props> = ({ ...rest }) => {
  return <Table {...rest} />
}
