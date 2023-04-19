import { createStyles } from '@mantine/core'

export const useInputHorizontalStyles = createStyles((theme) => ({
  root: {
    display: 'grid',
    alignItems: 'center',
    gridTemplateColumns: '1fr 1fr'
  },
  label: {
    display: 'inline-grid'
  },
  wrapper: {
    display: 'inline-grid'
  },
  description: {
    display: 'inline-grid',
    gridColumnStart: 1,
    gridColumnEnd: 3,
    gridRowStart: 2,
    gridRowEnd: 2
  }
}))
