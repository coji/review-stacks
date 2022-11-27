import { Gitlab } from '@gitbeaker/node'
import dayjs from '~/libs/dayjs'

interface createFetcherProps {
  projectId: string
  privateToken: string
}

export const createFetcher = ({
  projectId,
  privateToken
}: createFetcherProps) => {
  const api = new Gitlab({ token: privateToken })

  const openedMergerequests = async () =>
    await api.MergeRequests.all({ projectId, state: 'opened', sort: 'asc' })

  const closedInWeekMergerequests = async () =>
    await api.MergeRequests.all({
      projectId,
      state: 'merged',
      updatedAfter: dayjs().subtract(7, 'days').toISOString(),
      sort: 'asc'
    })

  return {
    openedMergerequests,
    closedInWeekMergerequests
  }
}
