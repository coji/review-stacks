import { Stack } from '@chakra-ui/react'

interface ReviewStacksProps {
  children: React.ReactNode
}

export const ReviewStacks = ({ children }: ReviewStacksProps) => (
  <Stack gap="0" p="4">
    {children}
  </Stack>
)
