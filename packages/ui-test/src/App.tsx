// import { ModalsProvider } from '@appser/ui'
// import { Box, Button, Center, ColorSchemeProvider, MantineProvider } from '@mantine/core'
import { Box, Button, Center, ColorSchemeProvider, MantineProvider, ModalsProvider, AppserUIProvider } from '@appser/ui'
// import { ModalsProvider } from '@mantine/modals'

export function App() {
  // useForm()

  return (
    // <ColorSchemeProvider colorScheme='light' toggleColorScheme={() => {}}>
    //   <MantineProvider theme={{}}>
    <AppserUIProvider colorScheme='light' toggleColorScheme={() => {}}>
<ModalsProvider modals={{}}>
          <Box>lalala</Box>
          <Center>dddddd</Center>
          <Button>dddd</Button>
          {/* <DatePicker /> */}
        </ModalsProvider>
    </AppserUIProvider>
        
    //   </MantineProvider>

    // </ColorSchemeProvider>
  )
}
