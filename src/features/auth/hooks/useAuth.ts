import {
  QueryKey,
  useQuery,
  useQueryClient,
  UseQueryOptions,
  UseQueryResult
} from '@tanstack/react-query'
import {
  Auth,
  User,
  AuthError,
  getRedirectResult,
  getAdditionalUserInfo,
  AdditionalUserInfo
} from 'firebase/auth'
import { auth, firestore } from '~/libs/firebase'
import { getDoc, doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { match } from 'ts-pattern'

interface AppUser extends User {
  teamId: string | null
}

const getTeamId = (additionalUserInfo: AdditionalUserInfo | null) => {
  const teamId = additionalUserInfo?.profile?.['https://slack.com/team_id']
  if (teamId) {
    return teamId as string
  } else {
    return null
  }
}

// users コレクションに upsert
const upsertUser = async (user: User, teamId: string | null) => {
  const params = {
    uid: user.uid,
    displayName: user.displayName || 'user',
    photoUrl: user.photoURL,
    email: user.email,
    emailVerified: user.emailVerified,
    providers: user.providerData.map((provider) => provider.providerId),
    updatedAt: serverTimestamp(),
    teamId
  }

  const docRef = doc(firestore, `/users/${user.uid}`)
  await setDoc(docRef, params, { merge: true })
}

export function useAuthUser<R = AppUser | null>(
  key: QueryKey,
  auth: Auth,
  useQueryOptions?: Omit<
    UseQueryOptions<AppUser | null, AuthError, R>,
    'queryFn'
  >
): UseQueryResult<R, AuthError> {
  const queryClient = useQueryClient()

  return useQuery({
    ...useQueryOptions,
    queryKey: key,
    staleTime: Infinity,
    async queryFn() {
      let resolved = false

      return new Promise<AppUser | null>((resolve, reject) => {
        auth.onAuthStateChanged(async (user) => {
          let teamId: string | null = null
          if (user) {
            const credential = await getRedirectResult(auth)
            if (credential) {
              // ログイン処理を行ったときはユーザ情報をアップデート
              const additionalUserInfo = getAdditionalUserInfo(credential)
              teamId = getTeamId(additionalUserInfo) // 所属チームIDを取得
              await upsertUser(user, teamId)
            } else {
              // ログイン状態を保持して再アクセスされた場合はユーザドキュメントから teamId を取得
              const userDoc = await getDoc(doc(firestore, `/users/${user.uid}`))
              const userData = userDoc.data()
              if (userData) {
                teamId = userData['teamId'] as string
              }
            }
          }
          const appUser = user ? { ...user, teamId } : null

          if (!resolved) {
            resolved = true
            resolve(appUser as AppUser)
          } else {
            queryClient.setQueryData<AppUser | null>(key, appUser as AppUser)
          }
        }, reject)
      })
    }
  })
}

export const useAuth = () => {
  const currentUser = useAuthUser(['user'], auth)
  return {
    currentUser: currentUser.data,
    isAuthChecking: currentUser.isLoading
  }
}
