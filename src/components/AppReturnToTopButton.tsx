import NextLink from 'next/link'
import { Box, Button } from '@chakra-ui/react'

export const AppReturnToTopButton = () => (
  <Box textAlign="center" my="4rem">
    <NextLink href="/" passHref>
      <Button colorScheme="blue" as="a" variant="outline">
        トップに戻る
      </Button>
    </NextLink>
  </Box>
)
