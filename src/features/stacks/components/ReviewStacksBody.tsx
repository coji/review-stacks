import { Stack, Grid } from '@chakra-ui/react'

interface ReviewStacksBodyProps {
  children: React.ReactNode[]
}
export const ReviewStacksBody = ({ children }: ReviewStacksBodyProps) => (
  <Stack>
    <Grid gap="4" templateColumns={{ base: '1fr', md: '1fr 1fr' }}>
      {children.map((child) => child)}
    </Grid>
  </Stack>
)
