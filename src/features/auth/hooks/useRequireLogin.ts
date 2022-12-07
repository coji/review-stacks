import { useAuth } from './useAuth'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export const useRequireLogin = () => {
  const { isAuthChecking, currentUser } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthChecking && !currentUser) {
      void router.push(`/signin?r=${router.asPath}`)
    }
  }, [router, isAuthChecking, currentUser])

  return {
    currentUser,
    isAuthChecking
  }
}
