import { Box } from '@chakra-ui/react'
import Div100vh from 'react-div-100vh'
import { AppNavbar } from '../components/AppNavbar'
import { AppFooter } from '../components/AppFooter'

interface AppDefaultLayoutProps {
  children: React.ReactNode
}

export const AppDefaultLayout: React.FC<AppDefaultLayoutProps> = ({
  children
}) => {
  return (
    <Div100vh>
      <Box display="grid" gridTemplateRows="auto 1fr auto" minH="100vh">
        <AppNavbar />

        <Box as="main" p={{ base: '0', sm: '2' }} overflow="auto" flexGrow="1">
          {children}
        </Box>

        <AppFooter />
      </Box>
    </Div100vh>
  )
}
