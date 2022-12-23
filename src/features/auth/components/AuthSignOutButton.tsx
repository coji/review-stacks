import { Button } from '@chakra-ui/react'
import { useAuthAction } from '~/features/auth/hooks/useAuthAction'

export const AuthSignOutButton = () => {
  const { signOut } = useAuthAction()
  return (
    <Button colorScheme="blue" onClick={() => signOut()} variant="outline">
      サインアウト
    </Button>
  )
}
