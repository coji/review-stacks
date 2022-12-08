import {
  useQuery,
  useQueryClient,
  type QueryClient
} from '@tanstack/react-query'
import {
  Auth,
  User,
  getRedirectResult,
  getAdditionalUserInfo,
  UserCredential
} from 'firebase/auth'
import { auth, firestore } from '~/libs/firebase'
import { getDoc, doc, setDoc, serverTimestamp } from 'firebase/firestore'

interface AppUser extends Pick<User, 'displayName' | 'email' | 'photoURL'> {
  teamId: string | null
}

const initTeamId = async (auth: Auth, user: User | null) => {
  let teamId: string | null = null
  if (user) {
    const credential = await getRedirectResult(auth)
    teamId = getTeamId(credential)
    if (teamId) {
      await upsertUser(user, teamId) // ログイン処理を行ったときはユーザ情報をアップデート
    } else {
      teamId = await fetchTeamId(user.uid) // ログイン状態を保持して再アクセスされた場合はユーザドキュメントから teamId を取得
    }
  }
  return teamId
}

const getTeamId = (credential: UserCredential | null) => {
  if (!credential) return null
  const additionalUserInfo = getAdditionalUserInfo(credential)
  const teamId = additionalUserInfo?.profile?.['https://slack.com/team_id']
  return teamId ? String(teamId) : null
}

const fetchTeamId = async (uid: string) => {
  const userDoc = await getDoc(doc(firestore, `/users/${uid}`))
  const userData = userDoc.data()
  if (userData) {
    return userData['teamId'] as string
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

const authUser = async (auth: Auth, queryClient: QueryClient) => {
  let resolved = false // 1回目だけ resolve させる
  return new Promise<AppUser | undefined>((resolve, reject) => {
    auth.onAuthStateChanged((user) => {
      initTeamId(auth, user)
        .then((teamId) => {
          const appUser = user
            ? {
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                teamId
              }
            : undefined
          if (!resolved) {
            resolved = true // 1回目だけ resolve させる
            resolve(appUser)
          } else {
            // 複数コンポーネントから利用されるケースなど2回目以降(ログアウト時等)はデータだけ更新。
            queryClient.setQueryData<AppUser | null>(['user'], appUser)
          }
        })
        .catch(() => {
          reject()
        })
    })
  })
}

export const useAuth = () => {
  const queryClient = useQueryClient()
  const { data, isLoading } = useQuery(
    ['user'],
    async () => authUser(auth, queryClient),
    { staleTime: Infinity }
  )
  return {
    currentUser: data,
    isAuthChecking: isLoading
  }
}
