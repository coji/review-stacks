import NextLink from 'next/link'
import { Box, Button } from '@chakra-ui/react'

export const AppReturnToTopButton = () => (
  <Box my="4rem" textAlign="center">
    <Button as={NextLink} colorScheme="blue" href="/" variant="outline">
      トップに戻る
    </Button>
  </Box>
)
