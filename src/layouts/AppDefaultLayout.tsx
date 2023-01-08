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
        min-height: 100vh;
        min-height: 100dvh;
      `}
    >
      <AppNavbar />

      <Box as="main" p={{ base: '0', sm: '2' }}>
        {children}
      </Box>

      <AppFooter />
    </Grid>
  )
}
