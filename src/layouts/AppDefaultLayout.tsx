import { Box, Grid } from '@chakra-ui/react'
import Div100vh from 'react-div-100vh'
import { AppNavbar } from '../components/AppNavbar'
import { AppFooter } from '../components/AppFooter'

interface AppDefaultLayoutProps {
  children: React.ReactNode
}

export const AppDefaultLayout = ({ children }: AppDefaultLayoutProps) => {
  return (
    <Div100vh>
      <Grid templateRows="auto 1fr auto" minH="100vh">
        <AppNavbar />

        <Box as="main" flexGrow="1" overflow="auto" p={{ base: '0', sm: '2' }}>
          {children}
        </Box>

        <AppFooter />
      </Grid>
    </Div100vh>
  )
}
