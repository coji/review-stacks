import NextLink from 'next/link'
import { Box, Button } from '@chakra-ui/react'

export const AppReturnToTopButton = () => (
  <Box textAlign="center" my="4rem">
    <Button as={NextLink} href="/" colorScheme="blue" variant="outline">
      トップに戻る
    </Button>
  </Box>
)
