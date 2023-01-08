import { Button } from '@chakra-ui/react'
import { useAuthSignOut } from '~/features/auth/hooks/useAuthAction'

export const AuthSignOutButton = () => {
  const { isLoading, mutate } = useAuthSignOut()
  return (
    <Button
      colorScheme="blue"
      isLoading={isLoading}
      onClick={() => mutate()}
      variant="outline"
    >
      サインアウト
    </Button>
  )
}
