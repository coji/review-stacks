import { Box, Grid } from '@chakra-ui/react'
import { AppNavbar } from '../components/AppNavbar'
import { AppFooter } from '../components/AppFooter'

interface AppDefaultLayoutProps {
  children: React.ReactNode
}

export const AppDefaultLayout = ({ children }: AppDefaultLayoutProps) => {
  return (
    <Grid
      templateRows="auto 1fr auto"
      css={`
        height: 100vh;
        height: 100dvh;
      `}
    >
      <AppNavbar />

      <Box as="main" flexGrow="1" overflow="auto" p={{ base: '0', sm: '2' }}>
        {children}
      </Box>

      <AppFooter />
    </Grid>
  )
}
