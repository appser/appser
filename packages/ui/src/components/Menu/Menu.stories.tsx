import { Button, Menu, Text } from '@mantine/core'

export default {
  title: 'ui/Menu'
}

export const App = () => {
  return (
    <Menu width={200} classNames={{}}>
      <Menu.Target>
        <Button>Toggle menu</Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Application</Menu.Label>
        <Menu.Item>Settings</Menu.Item>
        <Menu.Item>Messages</Menu.Item>
        <Menu.Item>Gallery</Menu.Item>
        <Menu.Item
          rightSection={
            <Text size="xs" color="dimmed">
              ⌘K
            </Text>
          }
        >
          Search
        </Menu.Item>

        <Menu.Divider />

        <Menu.Label>Danger zone</Menu.Label>
        <Menu.Item>Transfer my data</Menu.Item>
        <Menu.Item color="red">Delete my account</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}
