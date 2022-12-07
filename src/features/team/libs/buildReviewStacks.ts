import type { Types } from '@gitbeaker/node/dist/types'
import { ReviewStackItem, UserInfo } from '~/interfaces/model'

const addMR = (
  assigneesOrReviewers: Map<string, Types.MergeRequestSchema[]>,
  username: string,
  mr: Types.MergeRequestSchema
) => {
  const exist = assigneesOrReviewers.get(username) ?? []
  assigneesOrReviewers.set(username, [...exist, mr])
}

const buildUserInfo = (user: Omit<Types.UserSchema, 'created_at'>) => {
  return {
    username: user.username,
    name: user.name,
    avatar: user.avatar_url,
    assigned: [],
    reviews: []
  } as UserInfo
}

const buildAssigneesAndReviewers = (
  users: Record<string, UserInfo>,
  assignees: Map<string, Types.MergeRequestSchema[]>,
  reviewers: Map<string, Types.MergeRequestSchema[]>,
  mr: Types.MergeRequestSchema
) => {
  const assignee = mr.assignee ?? mr.author
  const assigneeUsername = String(assignee.username)
  users[String(assignee.username)] ||= buildUserInfo(assignee)
  addMR(assignees, assigneeUsername, mr)

  if (mr.reviewers) {
    for (const reviewer of mr.reviewers) {
      const reviewerUsername = String(reviewer.username)
      users[reviewerUsername] ||= buildUserInfo(reviewer)
      addMR(reviewers, reviewerUsername, mr)
    }
  }
}

const buildReviewStackItems = (
  users: { [key: string]: UserInfo },
  assigneesOrReviewers: Map<string, Types.MergeRequestSchema[]>
) => {
  return Array.from(assigneesOrReviewers.entries())
    .map(
      (entry) =>
        ({
          user: users[entry[0]],
          mergerequests: entry[1]
        } as ReviewStackItem)
    )
    .sort((a, b) => (b.mergerequests.length >= a.mergerequests.length ? 1 : -1))
}

export const buildReviewStacks = (
  mergerequests: Types.MergeRequestSchema[]
) => {
  const users: Record<string, UserInfo> = {}
  const assignees = new Map<string, Types.MergeRequestSchema[]>()
  const reviewers = new Map<string, Types.MergeRequestSchema[]>()

  for (const mr of mergerequests) {
    buildAssigneesAndReviewers(users, assignees, reviewers, mr)
  }

  for (const username of Object.keys(users)) {
    users[username].assigned = assignees.get(username)
    users[username].reviews = reviewers.get(username)
  }

  return {
    users,
    assignees: buildReviewStackItems(users, assignees),
    reviewers: buildReviewStackItems(users, reviewers)
  }
}
