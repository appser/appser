import { Select, createStyles } from '@appser/ui'
import { useTranslation } from 'react-i18next'

import { IconGlobe } from '../icons/IconGlobe'

import type { SelectProps } from '@appser/ui'
import type { FC } from 'react'

interface LanguageSelectProps extends Omit<SelectProps, 'data'> {
}

const useStyles = createStyles((theme) => ({
}))

export const LanguageSelect: FC<LanguageSelectProps> = ({ ...rest }) => {
  const { i18n } = useTranslation()
  const { classes } = useStyles()

  const languageData: Array<{ label: string; value: string }> = [
    { label: 'English', value: 'en' },
    { label: '简体中文', value: 'zh-CN' }
  ]

  return (
    <Select
      placeholder="Pick one"
      icon={<IconGlobe size={14} />}
      data={languageData}
      defaultValue={i18n.language}
      variant='unstyled'
      onChange={v => v && i18n.changeLanguage(v)}
      {...rest}
    />

  )
}
