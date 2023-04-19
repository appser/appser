import { useInputSubtleVariantStyles } from '@appser/ui'
import { Box, Paper, TextInput, Title, createStyles } from '@mantine/core'

import { FormSectionDivider } from './FormSectionDivider'
import { FormSectionItem } from './FormSectionItem'
import { FormSectionNumberInput } from './FormSectionNumberInput'
import { FormSectionSelect } from './FormSectionSelect'
import { FormSectionSwitch } from './FormSectionSwitch'
import { Background } from '../Background'

import type { FormSectionItemProps } from './FormSectionItem'
import type { BoxProps, NumberInputProps, SelectProps, TextInputProps } from '@mantine/core'

export const useStyles = createStyles((theme) => ({
  title: {
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 8,
    paddingLeft: theme.spacing.sm
  }
}))

export const useInputStyles = createStyles((theme) => ({
  input: {
    height: 30,
    minHeight: 30,
    textAlign: 'right'
  }
}))

interface FormSectionProps extends BoxProps {
  title?: string | null
}

export const FormSection = ({ title, bg, children, ...rest }: FormSectionProps) => {
  const { classes, cx } = useStyles()

  return (
    <Box w='100%' {...rest}>
      {title ? (<Title className={classes.title}>{title}</Title>) : null}
      <Paper component={Background} withBorder bg={bg} radius='sm' px='sm'>
        {children}
      </Paper>
    </Box>
  )
}

function formSectionInputHoc<T extends FormSectionItemProps>(Component: any) {
  return ({ label, description, status, ...props }: T & FormSectionItemProps) => {
    const { classes, cx } = useInputSubtleVariantStyles()
    const { classes: classes2 } = useInputStyles()

    return (
      <FormSectionItem
        align={description ? 'baseline' : 'center'}
        status={status}
        label={label}
        description={description}
        mb={description ? 6 : 0}
      >
        <Component classNames={classes} {...props} />
      </FormSectionItem>
    )
  }
}

FormSection.Item = FormSectionItem
FormSection.Divider = FormSectionDivider
FormSection.TextInput = formSectionInputHoc<TextInputProps>(TextInput)
FormSection.NumberInput = formSectionInputHoc<NumberInputProps>(FormSectionNumberInput)
FormSection.Select = formSectionInputHoc<SelectProps>(FormSectionSelect)
FormSection.Switch = FormSectionSwitch
