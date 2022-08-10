import { useAuthUser } from './useAuth'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { auth } from '~/libs/firebase'

export const useRequireLogin = () => {
  const currentUser = useAuthUser(['user'], auth)
  const router = useRouter()

  useEffect(() => {
    if (!currentUser.isLoading && !currentUser.data) {
      router.push(`/signin?r=${router.asPath}`)
    }
  }, [router, currentUser.isLoading, currentUser.data])

  return {
    currentUser: currentUser.data,
    isAuthChecking: currentUser.isLoading
  }
}
