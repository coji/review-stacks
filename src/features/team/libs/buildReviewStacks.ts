import type { Types } from '@gitbeaker/node/dist/types'
import {
  ReviewStacks,
  ReviewStackItem,
  PullRequest,
  UserInfo,
  User
} from '~/interfaces/model'

const convertGitLabUserToUser = (
  user: Omit<Types.UserSchema, 'created_at'>
) => {
  return {
    username: user.username as string,
    name: user.name as string,
    avatar: user.avatar_url as string
  }
}

const convertGitLabUserToUserOptional = (
  user: Omit<Types.UserSchema, 'created_at'> | null
) => {
  if (!user) return null
  return convertGitLabUserToUser(user)
}

const convertGitLabMergerquestToPullRequest = (
  mergerequest: Types.MergeRequestSchema
): PullRequest => {
  return {
    id: mergerequest.id,
    number: mergerequest.iid,
    assignee: convertGitLabUserToUserOptional(mergerequest.assignee),
    author: convertGitLabUserToUser(mergerequest.author),
    reviewers: mergerequest.reviewers?.map(convertGitLabUserToUser) ?? [],
    title: mergerequest.title,
    webUrl: mergerequest.web_url,
    state: mergerequest.state,
    mergedAt: mergerequest.merged_at,
    updatedAt: mergerequest.updated_at,
    createdAt: mergerequest.created_at
  }
}

const addPR = (
  assigneesOrReviewers: Map<string, object[] /*Types.MergeRequestSchema[]*/>,
  username: string,
  pr: PullRequest
) => {
  const exist = assigneesOrReviewers.get(username) ?? []
  assigneesOrReviewers.set(username, [...exist, pr])
}

const buildUserInfo = (user: User) => {
  return {
    username: user.username,
    name: user.name,
    avatar: user.avatar,
    assigned: [],
    reviews: []
  } as UserInfo
}

const buildAssigneesAndReviewers = (
  users: Record<string, UserInfo>,
  assignees: Map<string, object[] /*Types.MergeRequestSchema[]*/>,
  reviewers: Map<string, object[] /*Types.MergeRequestSchema[]*/>,
  mr: Types.MergeRequestSchema
) => {
  const pullrequest = convertGitLabMergerquestToPullRequest(mr)
  const assignee = pullrequest.assignee ?? pullrequest.author
  const assigneeUsername = String(assignee.username)
  users[String(assignee.username)] ||= buildUserInfo(assignee)
  addPR(assignees, assigneeUsername, pullrequest)

  if (mr.reviewers) {
    for (const reviewer of mr.reviewers.map((r) =>
      convertGitLabUserToUser(r)
    )) {
      const reviewerUsername = String(reviewer.username)
      users[reviewerUsername] ||= buildUserInfo(reviewer)
      addPR(reviewers, reviewerUsername, pullrequest)
    }
  }
}

const buildReviewStackItems = (
  users: { [key: string]: UserInfo },
  assigneesOrReviewers: Map<string, PullRequest[]>
): ReviewStackItem[] => {
  return Array.from(assigneesOrReviewers.entries())
    .map((entry) => ({
      user: users[entry[0]],
      pullrequests: entry[1]
    }))
    .sort((a, b) => (b.pullrequests.length >= a.pullrequests.length ? 1 : -1))
}

export const buildReviewStacks = (
  mergerequests: Types.MergeRequestSchema[]
): ReviewStacks => {
  const users: Record<string, UserInfo> = {}
  const assignees = new Map<string, PullRequest[]>()
  const reviewers = new Map<string, PullRequest[]>()

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
