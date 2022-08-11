import { Team } from '../interfaces/team'
import { firestore } from '~/libs/firebase-admin.server'
import type { Types } from '@gitbeaker/node/dist/types'
import dayjs from 'dayjs'

// team を1件取得
export const getTeam = async (teamId: string) => {
  const docRef = firestore.doc(`/teams/${teamId}`)
  const doc = await docRef.get()
  if (!doc.exists) {
    throw Error(`Team not found: ${teamId}`)
  }
  return {
    id: doc.id,
    ...doc.data()
  } as Team
}

export const updateTeam = async (
  teamId: string,
  mergerequests: Types.MergeRequestSchema[]
) => {
  const docRef = firestore.doc(`/teams/${teamId}`)
  docRef.set(
    { mergerequests, updatedAt: dayjs().toISOString() },
    { merge: true }
  )
}
