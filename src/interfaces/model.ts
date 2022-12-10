export interface User {
  username: string
  name: string
  avatar: string
}

export interface ReviewStackItem {
  user: User
  pullrequests: PullRequest[] // Types.MergeRequestSchema[]
}

export interface PullRequest {
  id: number
  number: number // pull number or iid
  assignee?: User
  author: User
  reviewers: User[]
  title: string
  webUrl: string
  state: string
  mergedAt: string
  updatedAt: string
  createdAt: string
}

export interface UserInfo extends User {
  assigned?: PullRequest[]
  reviews?: PullRequest[]
}
