import { colors } from '@appser/ui'
import { Flex, useMantineTheme } from '@mantine/core'

import { useFields } from '../fields'

import type { FieldType } from '../fields'
import type { FC } from 'react'

interface Props {
  type: FieldType
  size?: number
}

export const FieldIcon: FC<Props> = ({ type, size = 30 }) => {
  const fields = useFields()
  const { colorScheme } = useMantineTheme()
  const color = colors[colorScheme].icon
  const icon = fields[type]?.icon({ bgColor: 'transparent', fgColor: color })

  if (!icon) return null

  return <Flex w={size} h={size} align='center' justify="center" c="gray" dangerouslySetInnerHTML={{ __html: icon }} />
}
