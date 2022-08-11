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

export const useTeam = (id?: string | null) => {
  return useQuery(['team', id], () => fetchTeam(id!), {
    enabled: !!id
  })
}

export const useTeamUpdator = (id?: string | null) => {
  const unsubscribe = useRef<ReturnType<typeof onSnapshot>>()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!id) {
      return
    }

    unsubscribe.current = onSnapshot(
      doc(firestore, `teams/${id}`),
      (snapshot) => {
        const data = snapshot.data()
        queryClient.setQueryData(['team', id], data)
        //      queryClient.invalidateQueries(['team', id])
      }
    )

    return () => {
      if (unsubscribe.current) unsubscribe.current()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
