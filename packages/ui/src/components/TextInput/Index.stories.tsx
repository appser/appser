import { TextInput } from '@mantine/core'

import { useInputWithInsideLabelStyles } from '../../styles'
import { useInputHorizontalStyles } from '../../styles/useInputHorizontalStyles'
import { useInputSubtleVariantStyles } from '../../styles/useInputSubtleVariantStyles'

export default {
  title: 'ui/TextInput'
}

export const App = () => <TextInput w={300} />

export const Error = () => <TextInput w={100} error="some long error, some long error, some long error" />

export const Horizontal = () => {
  const { classes } = useInputHorizontalStyles()

  return <TextInput classNames={classes} w={300} label='nickname' />
}

export const InsideLabel = () => {
  const { classes } = useInputWithInsideLabelStyles()

  return <TextInput classNames={classes} w={300} label='nickname' />
}

export const Subtle = () => {
  const { classes } = useInputSubtleVariantStyles()

  return <TextInput classNames={classes} value='333333' w={300} label='nickname' />
}
