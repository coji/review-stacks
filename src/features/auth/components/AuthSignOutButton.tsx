import { Button } from '@chakra-ui/react'
import { useAuthAction } from '~/features/auth/hooks/useAuthAction'

export const AuthSignOutButton = () => {
  const { signOut } = useAuthAction()
  return (
    <Button variant="outline" colorScheme="blue" onClick={() => signOut()}>
      サインアウト
    </Button>
  )
}
