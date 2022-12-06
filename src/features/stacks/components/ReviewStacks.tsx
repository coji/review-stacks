import { Stack } from '@chakra-ui/react'

interface ReviewStacksProps {
  children: React.ReactNode
}

export const ReviewStacks = ({ children }: ReviewStacksProps) => (
  <Stack>{children}</Stack>
)
