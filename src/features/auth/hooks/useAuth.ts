import { useQuery } from '@tanstack/react-query'
import { type User } from 'firebase/auth'

interface AppUser extends Pick<User, 'displayName' | 'email' | 'photoURL'> {
  teamId: string | null
}

export const useAuth = () => {
  const { data, isLoading } = useQuery<AppUser | null>(['user'], () => null, {
    staleTime: Infinity
  })

  return {
    currentUser: data ?? null,
    isAuthChecking: isLoading
  }
}
