import { Select, createStyles, useMantineColorScheme } from '@appser/ui'
import { useLocalStorage } from '@appser/ui'
import { useTranslation } from 'react-i18next'

import { IconMoon } from '../icons/IconMoon'
import { IconSun } from '../icons/IconSun'

import type { SelectProps } from '@appser/ui'
import type { FC } from 'react'
import type { ImprovedColorScheme } from 'web/hooks/useImprovedColorScheme'

interface ThemeSelectProps extends Omit<SelectProps, 'data'> {
}

const useStyles = createStyles((theme) => {
  return {
  }
})

export const ThemeSelect: FC<ThemeSelectProps> = ({ ...rest }) => {
  const { t } = useTranslation()
  const { classes } = useStyles()
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()

  const [colorSchemeLocalStorage] = useLocalStorage<ImprovedColorScheme>({
    key: 'mantine-color-scheme',
    defaultValue: '',
    getInitialValueInEffect: true
  })

  const themeData: Array<{ label: string; value: ImprovedColorScheme }> = [
    { label: t('component.ThemeSelect.light'), value: 'light' },
    { label: t('component.ThemeSelect.dark'), value: 'dark' },
    { label: t('component.ThemeSelect.system'), value: 'system' }
  ]

  return (
    <Select
      placeholder=""
      icon={colorScheme === 'light' ? <IconSun size={14} /> : <IconMoon size={14} />}
      value={colorSchemeLocalStorage}
      data={themeData}
      variant='unstyled'
      onChange={v => v && toggleColorScheme(v as never)}
      {...rest}
    />
  )
}
