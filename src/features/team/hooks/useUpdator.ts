import { auth } from '~/libs/firebase'
import ky from 'ky'

export const useUpdator = (teamId?: string | null) => {
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
