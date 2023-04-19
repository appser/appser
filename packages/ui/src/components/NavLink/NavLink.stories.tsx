import { Box, NavLink } from '@mantine/core'

export default {
  title: 'ui/NavLink'
}

export const App = () => {
  return (
    <Box sx={{ width: 240 }}>
      <NavLink label="Disabled" disabled />
      <NavLink label="With description" description="Additional information" />
      <NavLink label="Active subtle" variant="subtle" active />
      <NavLink label="Active light" active />
      <NavLink label="Active filled" variant="filled" active />
    </Box>
  )
}
