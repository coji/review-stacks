import { Stack, Grid } from '@chakra-ui/react'

interface ReviewStacksBodyProps {
  children: React.ReactNode[]
}
export const ReviewStacksBody = ({ children }: ReviewStacksBodyProps) => (
  <Stack p="4">
    <Grid gridTemplateColumns={{ base: '1fr', md: '1fr 1fr' }} gap="4">
      {children.map((child) => child)}
    </Grid>
  </Stack>
)
