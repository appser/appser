import { Button, Group } from '@mantine/core'

export default {
  title: 'ui/Button'
}

export const App = () => {
  return (
    <Group>
      <Button size='xl'>size xl</Button>
      <Button size='lg'>size lg</Button>
      <Button size='md'>size md</Button>
      <Button size='sm'>size sm</Button>
      <Button size='xs'>size xs</Button>
    </Group>
  )
}

export const Compact = () => {
  return (
    <Group>
      <Button compact size='xl'>size xl</Button>
      <Button compact size='lg'>size lg</Button>
      <Button compact size='md'>size md</Button>
      <Button compact size='sm'>size sm</Button>
      <Button compact size='xs'>size xs</Button>
    </Group>
  )
}
