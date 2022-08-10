import { firebase } from './firebase-admin'
import type { NextApiRequest } from 'next'

export const getIdTokenFromReq = async (req: NextApiRequest) => {
  const authHeader = req.headers['authorization']
  if (!authHeader || authHeader.split(' ')[0] !== 'Bearer') return null

  const idToken = authHeader.split(' ')[1]
  if (!idToken) return null
  return await firebase
    .auth()
    .verifyIdToken(idToken)
    .catch(() => null)
}
