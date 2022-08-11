import { Gitlab } from '@gitbeaker/node'

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
    await api.MergeRequests.all({ projectId, state: 'opened' })

  return {
    openedMergerequests
  }
}
