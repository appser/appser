import { useColorScheme } from '@mantine/hooks'

import { colors } from '..'

export function useColors() {
  const colorSchema = useColorScheme()

  return colors[colorSchema]
}
