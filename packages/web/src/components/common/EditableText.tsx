import { Flex, Text, TextInput, createStyles } from '@appser/ui'
import { useEffect, useRef, useState } from 'react'

import type { DefaultProps, Selectors, TextProps } from '@appser/ui'

interface EditableTextProps extends DefaultProps<EditableTextStylesNames, EditableTextStylesParams> {
  children?: string
  isEditable?: boolean
  tintColor?: string
  onCancel?: () => void
  onConfirm?: (v: string) => void
}

interface EditableTextStylesParams {
  isEditable?: boolean
  tintColor?: string
}

const useStyles = createStyles((theme, { isEditable }: EditableTextStylesParams) => ({
  root: {
    minHeight: 30,
    alignItems: 'center'
  },
  input: {
    borderColor: isEditable ? theme.fn.primaryColor(theme.colorScheme) : 'transparent',
    fontSize: 'inherit',
    color: 'inherit'
  },
  text: {
    fontSize: 'inherit',
    color: 'inherit',
    userSelect: 'none'
  }
}))

type EditableTextStylesNames = Selectors<typeof useStyles>

const EditableText = ({ onCancel, onConfirm, isEditable, children, classNames, styles, unstyled }: EditableTextProps) => {
  const { classes } = useStyles({ isEditable }, { name: 'EditableText', classNames, styles, unstyled })
  const [value, setValue] = useState(children ?? '')
  const ref = useRef<HTMLInputElement | null>(null)
  const discard = useRef(false)
  const bakValue = useRef<string>(children ?? '')

  useEffect(() => {
    isEditable && ref.current?.focus()
  }, [isEditable])

  return (
    <Flex className={classes.root}>
      {
        isEditable
          ? (
            <TextInput
              classNames={{ input: classes.input }}
              autoFocus
              ref={ref}
              onClick={e => e.stopPropagation()}
              onKeyUp={(e) => {
                if (e.code === 'Escape') {
                  discard.current = true
                  ref.current?.blur()
                  setValue(bakValue.current)
                  onCancel?.()
                }

                if (e.code === 'Enter') ref.current?.blur()
              }}
              onBlur={() => {
                if (!discard.current) {
                  onConfirm?.(value)
                  bakValue.current = value
                }

                discard.current = false
              }}
              onFocus={() => {
                setTimeout(() => {
                  ref.current?.select()
                }, 10)
              }}
              onInput={e => setValue(e.currentTarget.value)}
              size='xs'
              value={value}
            />
            )
          : <Text className={classes.text}>{children}</Text>
      }
    </Flex>

  )
}

export default EditableText
