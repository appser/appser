import { Box, Button, Flex, SimpleGrid, Stack, Text } from '@appser/ui'
import { openContextModal } from '@appser/ui'//modals

import type { ContextModalProps } from '@appser/ui'//modals

export type AlertDialogProps = {
  icon?: React.ReactNode
  title?: string | null
  message?: string
  buttons: {
    label: string
    type?: 'cancel' | 'destructive' | 'normal'
    onClick?: (close: () => void) => void
  }[]
}

export function AlertDialogModal({ context, id, innerProps }: ContextModalProps<AlertDialogProps>) {
  const { icon, buttons, title, message } = innerProps
  const buttonCount = buttons.length
  const isVertical = buttonCount > 2 || buttonCount === 1

  return (
    <Stack>
      <Flex direction="column" justify="center" align='center'>
        {icon && <Box mb="md">{icon}</Box>}
        <Text ta="center" fw='bold' size="sm" mb={8}>{title}</Text>
        {message && <Text ta="center" size='sm'>{message}</Text>}
      </Flex>
      <SimpleGrid cols={isVertical ? 1 : 2} spacing={5}>
        {buttons.map(({ type = 'normal', label, onClick }, index) => {
          return (
            <Button
              size='xs'
              variant={type === 'cancel' ? 'default' : 'filled'}
              color={type === 'destructive' ? 'red' : undefined}
              key={index}
              onClick={() => {
                if (onClick) {
                  const close = () => context.closeModal(id)
                  onClick(close)
                } else {
                  context.closeModal(id)
                }
              }}
            >
              {label}
            </Button>
          )
        })}
      </SimpleGrid>
    </Stack>
  )
}

export const openAlertDialog = ({ title, message, buttons, icon }: AlertDialogProps) => openContextModal({
  modal: 'AlertDialogModal',
  withCloseButton: false,
  size: 260,
  transitionProps: {
    duration: 300
  },
  innerProps: {
    icon,
    title,
    message,
    buttons
  }
})
