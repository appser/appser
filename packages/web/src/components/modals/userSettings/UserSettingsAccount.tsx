import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FormSection } from 'web/components/common/FormSection'
import { IconChevronRight } from 'web/components/icons/IconChevronRight'

import { UserSettingsContainer } from './UserSettingsContainer'

export const UserSettingsAccount = () => {
  const { t } = useTranslation()
  const [setView, setPath] = useState<'changePassword'>()

  return (
    <UserSettingsContainer title={t('modal.userSettings.account.title')}>
      <FormSection>
        <FormSection.Item label={t('modal.userSettings.account.changePassword')} onClick={() => setPath('changePassword')}>
          <IconChevronRight size={16} />
        </FormSection.Item>
      </FormSection>
    </UserSettingsContainer>
  )
}
