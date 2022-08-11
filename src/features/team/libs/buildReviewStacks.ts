import type { Types } from '@gitbeaker/node/dist/types'
import { GitlabUser, ReviewStackItem } from '~/interfaces/model'

const addAssignMR = (
  assignees: Map<string, Types.MergeRequestSchema[]>,
  username: string,
  mr: Types.MergeRequestSchema
) => {
  const exist = assignees.get(username) ?? []
  assignees.set(username, [...exist, mr])
}

const addReviewMR = (
  reviewers: Map<string, Types.MergeRequestSchema[]>,
  username: string,
  mr: Types.MergeRequestSchema
) => {
  const exist = reviewers.get(username) ?? []
  reviewers.set(username, [...exist, mr])
}

export const buildReviewStacks = (
  mergerequests: Types.MergeRequestSchema[]
) => {
  const users = new Map()
  const assignees = new Map()
  const reviewers = new Map()

  for (const mr of mergerequests) {
    const assignee = mr.assignee ?? mr.author
    users.set(String(assignee.username), {
      username: assignee.username,
      name: assignee.name,
      avatar: assignee.avatar_url
    })
    addAssignMR(assignees, String(assignee.username), mr)

    if (mr.reviewers) {
      for (const reviewer of mr.reviewers) {
        users.set(reviewer.username, {
          username: reviewer.username,
          name: reviewer.name,
          avatar: reviewer.avatar_url
        })
        addReviewMR(reviewers, String(reviewer.username), mr)
      }
    }
  }

  return {
    assignees: Array.from(assignees.entries())
      .map(
        (entry) =>
          ({
            user: users.get(entry[0]),
            mergerequests: entry[1]
          } as ReviewStackItem)
      )
      .sort((a, b) =>
        b.mergerequests.length >= a.mergerequests.length ? 1 : -1
      ),
    reviewers: Array.from(reviewers.entries())
      .map(
        (entry) =>
          ({
            user: users.get(entry[0]),
            mergerequests: entry[1]
          } as ReviewStackItem)
      )
      .sort((a, b) =>
        b.mergerequests.length >= a.mergerequests.length ? 1 : -1
      )
  }
}
