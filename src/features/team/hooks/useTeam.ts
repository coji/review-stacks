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
    const data = snapshot.data(options)!
    return {
      id: data.id,
      ...data
    } as Team
  }
}

export const fetchTeam = async (id: string) => {
  const snapshot = await getDoc(
    doc(firestore, `teams/${id}`).withConverter(converter)
  )
  return snapshot.data()
}

export const useTeam = (isShowMerged: boolean) => {
  const { currentUser } = useAuth()
  const id = currentUser?.teamId
  const { update } = useUpdator(id)
  const unsubscribe = useRef<ReturnType<typeof onSnapshot>>()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!currentUser?.teamId) {
      return
    }

    unsubscribe.current = onSnapshot(
      doc(firestore, `teams/${id}`).withConverter(converter),
      (snapshot) => {
        const team = snapshot.data()
        queryClient.setQueryData(
          ['team', id],
          team
            ? {
                ...team,
                ...buildReviewStacks(
                  team.mergerequests.filter((mr) =>
                    isShowMerged ? true : mr.state !== 'merged'
                  )
                )
              }
            : undefined
        )
      }
    )
    return () => {
      if (unsubscribe.current) unsubscribe.current()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  return useQuery(
    ['team', id],
    async () => {
      update()
      return await fetchTeam(id!)
    },
    {
      enabled: !!id,
      select: (team) => {
        if (team)
          return {
            ...team,
            ...buildReviewStacks(
              team.mergerequests.filter((mr) =>
                isShowMerged ? true : mr.state !== 'merged'
              )
            )
          }
      }
    }
  )
}
