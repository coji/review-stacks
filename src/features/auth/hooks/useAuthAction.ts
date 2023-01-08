import {
  signInWithRedirect,
  signOut,
  OAuthProvider,
  signInWithPopup
} from 'firebase/auth'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { auth } from '~/libs/firebase'

export const useAuthSignInWithRedirect = () => {
  return useMutation(() => {
    const provider = new OAuthProvider('oidc.slack')
    return signInWithRedirect(auth, provider)
  })
}

export const useAuthSignInWithPopup = () => {
  return useMutation(() => {
    const provider = new OAuthProvider('oidc.slack')
    return signInWithPopup(auth, provider)
  })
}

export const useAuthSignOut = () => {
  const queryClient = useQueryClient()
  return useMutation(async () => {
    await signOut(auth)
    queryClient.setQueryData(['user'], null)
  })
}
