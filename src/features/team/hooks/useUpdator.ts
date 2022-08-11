import { useEffect } from 'react'
import { auth } from '~/libs/firebase'
import ky from 'ky'

export const useUpdator = (teamId?: string | null) => {
  useEffect(() => {
    if (teamId) update()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamId])

  const update = async () => {
    if (!auth.currentUser) return
    if (!teamId) return

    const token = await auth.currentUser.getIdToken()
    await ky.get('/api/update', {
      headers: {
        authorization: `Bearer ${token}`
      },
      searchParams: {
        teamId
      }
    })
  }

  return { update }
}
