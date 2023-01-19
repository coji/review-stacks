import { signOut, OAuthProvider, signInWithPopup } from 'firebase/auth'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { auth } from '~/libs/firebase'
import { initTeamId } from '../utils/authUtils'

export const useAuthSignInWithPopup = () => {
  const queryClient = useQueryClient()
  return useMutation(async () => {
    const provider = new OAuthProvider('oidc.slack')
    if (process.env.SLACK_TEAM_ID) {
      provider.setCustomParameters({ team: process.env.SLACK_TEAM_ID })
    }
    const userCredential = await signInWithPopup(auth, provider)
    if (!auth.currentUser) {
      throw new Error('ログインに失敗しました。')
    }
    const teamId = await initTeamId(auth, userCredential)
    if (!teamId) {
      throw new Error('チームIDの取得に失敗しました。')
    }

    queryClient.setQueryData(['user'], {
      displayName: auth.currentUser.displayName,
      email: auth.currentUser.email,
      photoURL: auth.currentUser.photoURL,
      teamId
    })
  })
}

export const useAuthSignOut = () => {
  const queryClient = useQueryClient()
  return useMutation(async () => {
    await signOut(auth)
    queryClient.setQueryData(['user'], null)
  })
}
