import { createStyles } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { FormSectionSelect } from 'web/components/common/FormSection/FormSectionSelect'
import { LanguageSelect } from 'web/components/common/LanguageSelect'
import { ThemeSelect } from 'web/components/common/ThemeSelect'

import { UserSettingsContainer } from './UserSettingsContainer'
import { FormSection } from '../../common/FormSection'

const useStyles = createStyles(theme => ({
  themeButton: {
    padding: 5,
    height: 'auto',
    borderRadius: theme.radius.md
  }
}))

export const UserSettingsAppearance = () => {
  const { t, i18n } = useTranslation()

  return (
    <UserSettingsContainer title={t('modal.userSettings.appearance.title')}>
      <FormSection title={t('modal.userSettings.appearance.theme')} mb="xl">
        <FormSection.Item label={t('modal.userSettings.appearance.themeMode')}>
          <ThemeSelect />
        </FormSection.Item>
      </FormSection>
      <FormSection title={t('modal.userSettings.appearance.language&region')}>
        <FormSection.Item label={t('modal.userSettings.appearance.language')}>
          <LanguageSelect />
        </FormSection.Item>
      </FormSection>
    </UserSettingsContainer>

  )
}
