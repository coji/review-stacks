import {
  Auth,
  User,
  getAdditionalUserInfo,
  type UserCredential
} from 'firebase/auth'
import { firestore } from '~/libs/firebase'
import { getDoc, doc, setDoc, serverTimestamp } from 'firebase/firestore'

export const initTeamId = async (
  auth: Auth,
  userCredential: UserCredential
) => {
  let teamId: string | null = null
  if (auth.currentUser) {
    teamId = getSlackTeamId(userCredential)
    if (teamId) {
      await upsertUser(auth.currentUser, teamId) // ログイン処理を行ったときはユーザ情報をアップデート
    } else {
      teamId = await fetchTeamId(auth.currentUser.uid) // ログイン状態を保持して再アクセスされた場合はユーザドキュメントから teamId を取得
    }
  }
  return teamId
}

export const getSlackTeamId = (credential: UserCredential | null) => {
  if (!credential) return null
  const additionalUserInfo = getAdditionalUserInfo(credential)
  const teamId = additionalUserInfo?.profile?.['https://slack.com/team_id']
  return teamId ? String(teamId) : null
}

export const fetchTeamId = async (uid: string) => {
  const userDoc = await getDoc(doc(firestore, `/users/${uid}`))
  const userData = userDoc.data()
  if (userData) {
    return userData['teamId'] as string
  } else {
    return null
  }
}

// users コレクションに upsert
export const upsertUser = async (user: User, teamId: string | null) => {
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
