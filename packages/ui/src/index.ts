import { ActionIcon } from './components/ActionIcon'
import { Button } from './components/Button'
import { Input } from './components/Input'
import { JsonInput } from './components/JsonInput'
import { Menu } from './components/Menu'
import { Modal } from './components/Modal'
import { NavLink } from './components/NavLink'
import { NumberInput } from './components/NumberInput'
import { PasswordInput } from './components/PasswordInput'
import { Popover } from './components/Popover'
import { Radio } from './components/Radio'
import { Text } from './components/Text'
import { TextInput } from './components/TextInput'
import { mantineTheme } from './theme'

export * from './components/ContextMenu'
export * from './components/Logo'
export * from './styles'
export { colors } from './theme/colors'
export { mantineTheme }

export * from '@mantine/dates'
// Layout
export {} from '@mantine/core'
export * from '@mantine/form'

mantineTheme.components = {
  ActionIcon,
  Text,
  Modal,
  Menu,
  Popover,
  NavLink,
  Button,
  TextInput,
  Input,
  JsonInput,
  NumberInput,
  PasswordInput,
  Radio
}
