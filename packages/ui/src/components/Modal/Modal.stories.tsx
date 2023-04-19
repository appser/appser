import { Button, Group, Modal } from '@mantine/core'
import { useState } from 'react'

export default {
  title: 'ui/Modal'
}

export const App = () => {
  const [opened, setOpened] = useState(false)

  return (
    <>
      <Modal opened={opened} onClose={() => setOpened(false)} title="Introduce yourself!">
        {/* Modal content */}
      </Modal>

      <Group position="center">
        <Button onClick={() => setOpened(true)}>Open Modal</Button>
      </Group>
    </>
  )
}
