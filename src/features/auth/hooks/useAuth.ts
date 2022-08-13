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

// displayName
// email
// photoURL
interface AppUser extends Pick<User, 'displayName' | 'email' | 'photoURL'> {
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

function useAuthUser<R = AppUser | null>(
  auth: Auth
): UseQueryResult<R, AuthError> {
  const queryClient = useQueryClient()

  return useQuery(
    ['user'],
    async () => {
      let resolved = false // 1回目だけ resolve させる
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
          const appUser: AppUser | null = user && {
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            teamId
          }

          if (!resolved) {
            // 1回目だけ resolve させる
            resolved = true
            resolve(appUser)
          } else {
            // 複数コンポーネントから利用されるケースなど2回目以降(ログアウト時等)はデータだけ更新。
            queryClient.setQueryData<AppUser | null>(['user'], appUser)
          }
        }, reject)
      })
    },
    {
      staleTime: Infinity
    }
  )
}

export const useAuth = () => {
  const currentUser = useAuthUser(auth)
  return {
    currentUser: currentUser.data,
    isAuthChecking: currentUser.isLoading
  }
}
