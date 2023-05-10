import { Flex, colors, useMantineTheme } from '@appser/ui'

import { useFieldsConfig } from '../fields'

import type { FieldType } from '../fields'
import type { FC } from 'react'

interface Props {
  type: FieldType
  size?: number
}

export const FieldTypeIcon: FC<Props> = ({ type, size = 30 }) => {
  const fields = useFieldsConfig()
  const { colorScheme } = useMantineTheme()
  const color = colors[colorScheme].icon
  const icon = fields[type]?.icon({ bgColor: 'transparent', fgColor: color })

  if (!icon) return null

  return <Flex w={size} h={size} align='center' justify="center" c="gray" dangerouslySetInnerHTML={{ __html: icon }} />
}
