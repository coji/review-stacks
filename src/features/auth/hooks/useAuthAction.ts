import {
  Auth,
  AuthError,
  AuthProvider,
  signInWithRedirect,
  signOut,
  GithubAuthProvider,
  OAuthProvider
} from 'firebase/auth'
import {
  useQueryClient,
  useMutation,
  UseMutationOptions,
  UseMutationResult
} from '@tanstack/react-query'
import { auth } from '~/libs/firebase'

export function useAuthSignInWithRedirect(
  auth: Auth,
  useMutationOptions?: UseMutationOptions<
    never,
    AuthError,
    { provider: AuthProvider }
  >
): UseMutationResult<never, AuthError, { provider: AuthProvider }> {
  return useMutation<never, AuthError, { provider: AuthProvider }>(
    ({ provider }) => {
      return signInWithRedirect(auth, provider)
    },
    useMutationOptions
  )
}

export function useAuthSignOut(
  auth: Auth
): UseMutationResult<void, AuthError, void> {
  const queryClient = useQueryClient()
  return useMutation(async () => {
    await signOut(auth)
    queryClient.setQueryData(['user'], () => null)
  })
}

export const useAuthAction = () => {
  const authSignIn = useAuthSignInWithRedirect(auth)
  const authSignOut = useAuthSignOut(auth)

  const signInWithGitHub = () => {
    const provider = new GithubAuthProvider()
    return authSignIn.mutate({
      provider
    })
  }

  const signInWithGitLab = () => {
    const provider = new OAuthProvider('oidc.gitlab')
    return authSignIn.mutate({
      provider
    })
  }

  const signInWithSlack = () => {
    const provider = new OAuthProvider('oidc.slack')
    return authSignIn.mutate({ provider })
  }

  const signOut = () => authSignOut.mutate()

  return {
    signInWithGitHub,
    signInWithGitLab,
    signInWithSlack,
    signOut
  }
}
