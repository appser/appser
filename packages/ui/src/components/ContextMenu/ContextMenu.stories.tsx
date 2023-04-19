import { Box, Button, Menu } from '@mantine/core'

import { ContextMenu } from './index'

export default {
  title: 'ui/ContextMenu'
}

export const App = () => (
  <Box>
    <ContextMenu>
      <ContextMenu.Target>
        <Button>Open context menu</Button>
      </ContextMenu.Target>
      <ContextMenu.Dropdown>
        <Menu.Item>Item 1</Menu.Item>
        <Menu.Item>Item 2</Menu.Item>
        <Menu.Item>Item 3</Menu.Item>
      </ContextMenu.Dropdown>
    </ContextMenu>
  </Box>
)
