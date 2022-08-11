import type { NextApiRequest } from 'next'
import admin from 'firebase-admin'

const initializeApp = () => {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY!.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL
    })
  })
}

export const getIdTokenFromRequest = async (req: NextApiRequest) => {
  const authHeader = req.headers['authorization']
  if (!authHeader || authHeader.split(' ')[0] !== 'Bearer') return null

  const idToken = authHeader.split(' ')[1]
  if (!idToken) return null
  return await firebase
    .auth()
    .verifyIdToken(idToken)
    .catch(() => null)
}

admin.apps.length ? admin.app() : initializeApp()

export const firebase = admin
export const firestore = admin.firestore()
export const auth = admin.auth()
