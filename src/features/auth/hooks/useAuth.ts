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
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, firestore } from '~/libs/firebase'
import { match } from 'ts-pattern'

// users コレクションに upsert
const upsertUser = async (
  user: User,
  additionalUserInfo: AdditionalUserInfo | null
) => {
  const profileUrl = match(user.providerData.at(0)?.providerId)
    .with('github', () => additionalUserInfo?.profile?.html_url as string)
    .with('gitlab', () => additionalUserInfo?.profile?.profile as string)
    .otherwise(() => undefined)

  const params = {
    uid: user.uid,
    displayName: user.displayName || 'user',
    photoUrl: user.photoURL,
    email: user.email,
    emailVerified: user.emailVerified,
    providers: user.providerData.map((provider) => provider.providerId),
    updatedAt: serverTimestamp(),
    profileUrl
  }

  // additional user info がない場合は更新しない
  if (params.profileUrl === undefined) {
    delete params.profileUrl
  }

  const docRef = doc(firestore, `/users/${user.uid}`)
  await setDoc(docRef, params, { merge: true })
}

export function useAuthUser<R = User | null>(
  key: QueryKey,
  auth: Auth,
  useQueryOptions?: Omit<UseQueryOptions<User | null, AuthError, R>, 'queryFn'>
): UseQueryResult<R, AuthError> {
  const queryClient = useQueryClient()

  return useQuery<User | null, AuthError, R>({
    ...useQueryOptions,
    queryKey: useQueryOptions?.queryKey ?? key,
    staleTime: useQueryOptions?.staleTime ?? Infinity,
    async queryFn() {
      let resolved = false

      return new Promise<User | null>((resolve, reject) => {
        auth.onAuthStateChanged(async (user) => {
          let additionalUserInfo = null
          if (user) {
            const credential = await getRedirectResult(auth)
            if (credential) {
              additionalUserInfo = getAdditionalUserInfo(credential)
            }

            // ユーザ情報を保存
            await upsertUser(user, additionalUserInfo)
          }

          if (!resolved) {
            resolved = true
            resolve(user)
          } else {
            queryClient.setQueryData<User | null>(key, user)
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
