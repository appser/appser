import { Box, Flex, Loader, Stack, Text } from '@appser/ui'
import { IconCircleCheck } from '@tabler/icons'

import { useStyles } from './index'

import type { BoxProps } from '@appser/ui'
import type { FC, ReactNode } from 'react'

export interface FormSectionItemProps extends BoxProps {
  label?: ReactNode
  description?: ReactNode
  align?: 'baseline' | 'center'
  status?: 'loading' | 'success'
}

export const FormSectionItem: FC<FormSectionItemProps> = ({ label, children, description, align = 'center', status, ...rest }) => {
  const { theme } = useStyles()

  return (
    <Box py={5} {...rest}>
      <Flex justify="space-between" align={align} mih={36}>
        <Stack justify="center" spacing={3}>
          <Text size="sm">{label}</Text>
          {description && (<Text c='dimmed' size="sm">{description}</Text>)}
        </Stack>
        <Flex justify="flex-end" sx={{ flex: 1, alignSelf: 'center' }} pr="xs">
          {status === 'loading' && <Loader size='xs' />}
          {status === 'success' && <IconCircleCheck color={theme.colorScheme === 'light' ? theme.colors.appser[5] : theme.colors.appser[6]} size={20} />}
        </Flex>
        {children}
      </Flex>
    </Box>
  )
}
