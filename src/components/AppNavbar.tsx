import NextLink from 'next/link'
import {
  Link,
  Flex,
  Heading,
  Spacer,
  CircularProgress,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Stack,
  Box,
  Text,
  Divider,
  Avatar
} from '@chakra-ui/react'
import { useAuth } from '~/features/auth/hooks/useAuth'
import { useAuthSignOut } from '~/features/auth/hooks/useAuthAction'

export const AppNavbar = () => {
  const { currentUser, isAuthChecking } = useAuth()
  const { mutate: signOutMutate } = useAuthSignOut()

  return (
    <Flex
      as="nav"
      align="center"
      w="full"
      px={{ base: '2', md: '4' }}
      py="2"
      shadow="sm"
      bgColor="gray.50"
    >
      <Link as={NextLink} _hover={{ textDecoration: 'none' }} href="/">
        <Heading
          fontWeight="extrabold"
          bgGradient="linear(to-l, #2879CA, #00FF80)"
          bgClip="text"
        >
          Review Stacks
        </Heading>
      </Link>

      <Spacer />

      {currentUser ? (
        <Menu>
          <MenuButton>
            <Avatar
              name={currentUser.displayName || undefined}
              size="sm"
              src={currentUser.photoURL || undefined}
            ></Avatar>
          </MenuButton>
          <MenuList>
            <MenuItem>
              <Stack direction="row">
                <Avatar
                  name={currentUser.displayName || undefined}
                  size="sm"
                  src={currentUser.photoURL || undefined}
                />

                <Box>
                  <Text fontSize="sm">{currentUser.displayName}</Text>
                  <Text color="gray.500" fontSize="xs">
                    {currentUser.email}
                  </Text>
                </Box>
              </Stack>
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => signOutMutate()}>Sign out</MenuItem>
          </MenuList>
        </Menu>
      ) : isAuthChecking ? (
        <CircularProgress isIndeterminate size="32px" />
      ) : (
        <></>
      )}
    </Flex>
  )
}
