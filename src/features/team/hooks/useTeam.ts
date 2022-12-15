import { useEffect, useRef } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  doc,
  getDoc,
  QueryDocumentSnapshot,
  SnapshotOptions,
  onSnapshot,
  DocumentData
} from 'firebase/firestore'
import type { Team } from '../interfaces/team'
import { firestore } from '~/libs/firebase'
import { useAuth } from '~/features/auth/hooks/useAuth'
import { useUpdator } from './useUpdator'
import { buildReviewStacks } from '../libs/buildReviewStacks'

const converter = {
  toFirestore(team: Team): DocumentData {
    return {
      ...team
    }
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Team {
    const data = snapshot.data(options)
    return {
      id: data.id as string,
      ...data
    } as Team
  }
}

const fetchTeam = async (id: string) => {
  const snapshot = await getDoc(
    doc(firestore, `teams/${id}`).withConverter(converter)
  )
  return snapshot.data()
}

const buildTeam = (isShowMerged: boolean, team?: Team) => {
  if (!team) {
    return
  }

  return {
    ...team,
    reviewStacks: buildReviewStacks(
      team.mergerequests.filter((mr) =>
        isShowMerged ? true : mr.state !== 'merged'
      )
    )
  }
}

export const useTeam = (isShowMerged: boolean) => {
  const { currentUser } = useAuth()
  const teamId = currentUser?.teamId
  const { update } = useUpdator(teamId)
  const unsubscribe = useRef<ReturnType<typeof onSnapshot>>()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!teamId) return
    unsubscribe.current = onSnapshot(doc(firestore, `teams/${teamId}`), () => {
      void queryClient.invalidateQueries(['team', teamId])
    })
    return () => {
      if (unsubscribe.current) unsubscribe.current()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamId])

  return useQuery(
    ['team', teamId],
    async () => {
      await update()
      if (teamId) return await fetchTeam(teamId)
    },
    {
      enabled: !!teamId,
      select: (team) => buildTeam(isShowMerged, team)
    }
  )
}
